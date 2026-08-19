/**
 * - Each auction lasts for 10s
 * - Remaining time for the auction should be displayed
 * - Every 3s "Other bidder" will bid from $5 to $20
 * - User enters bid and clicks Place Bid
 * - Bid gets accepted if higher than current bid
 * - Same or lower bids get rejected with message:
 *   "Bid too low, current highest is $X."
 * - Switching mid-countdown resets the bid for that item
 * - When timer reaches 0 that item's bidding ends (no resets)
 */
import { useEffect, useState, type ChangeEvent } from "react";

const resetBidItems = (items: BidItem[] | AuctionItem[]): BidItem[] => {
  return items.map((i) => resetBid(i));
};

const resetBid = (item: BidItem | AuctionItem): BidItem => {
  return {
    ...item,
    currentBid: item.startingBid,
    currentBidder: "house",
    closed: false,
  };
};

const AUCTION_TIME = 10;

export default function LiveAuctionPanel() {
  const [timeRemaining, setTimeRemaining] = useState<number>(AUCTION_TIME);
  const [bids, setBids] = useState<BidItem[]>(resetBidItems(auctionItems));
  const [currentAuction, setCurrentAuction] = useState<BidItem | null>(
    bids[0] || null,
  );
  const [userBid, setUserBid] = useState<number>(
    currentAuction?.startingBid || 0,
  );
  const [error, setError] = useState<string | null>(null);

  const onAuctionChange = (evt: ChangeEvent<HTMLSelectElement>) => {
    const bidId = parseInt(evt.target.value);
    const targetBidItem = bids.find((b) => b.id === bidId);
    if (!targetBidItem) return;

    // If bid has not ended reset it.
    setCurrentAuction(
      !targetBidItem.closed ? resetBid(targetBidItem) : targetBidItem,
    );
    if (!targetBidItem.closed) {
      setTimeRemaining(AUCTION_TIME);
    }
    setUserBid(targetBidItem.currentBid);
    setError(null);
  };

  const onUserBidChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setUserBid(parseInt(evt.target.value));
  };

  const onPlaceBidClicked = () => {
    if (!currentAuction) return;

    let rejectionMessage: string | null = null;

    setCurrentAuction((old) => {
      if (!old) return old;

      if (userBid <= old.currentBid) {
        rejectionMessage = `Bid too low, current highest is $${old.currentBid}.`;
        return old;
      }

      // If the bid is valid update the current auction
      return { ...old, currentBid: userBid, currentBidder: "me" };
    });

    setError(rejectionMessage);
  };

  useEffect(() => {
    // If auction's closed a countdown is not needed.
    if (currentAuction?.closed) return;

    const interval = setInterval(() => {
      setTimeRemaining((r) => (r > 0 ? r - 1 : 0));
    }, 1000);

    const rivalInterval = setInterval(() => {
      setCurrentAuction((old) => {
        if (!old || old.closed) return old;

        const increment = 5 * Math.floor(((Math.random() * 10) % 4) + 1);
        return {
          ...old,
          currentBid: old.currentBid + increment,
          currentBidder: "other",
        };
      });
    }, 3000);

    return () => {
      clearInterval(interval);
      clearInterval(rivalInterval);
    };
  }, [currentAuction?.id, currentAuction?.closed]);

  useEffect(() => {
    if (timeRemaining > 0 || !currentAuction) return;

    // Auction time ended, update bids.
    const updateAuction = async () => {
      const updatedAuction = { ...currentAuction, closed: true };
      setTimeRemaining(AUCTION_TIME);
      setCurrentAuction(updatedAuction);
      setBids((old) =>
        old.map((b) => (b.id === currentAuction.id ? updatedAuction : b)),
      );
    };

    updateAuction();
  }, [timeRemaining, currentAuction]);

  return (
    <div>
      <select name="auctionItems" id="auctionItems" onChange={onAuctionChange}>
        {bids.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
            {b.closed && ` - ${b.currentBidder}`}
          </option>
        ))}
      </select>
      {currentAuction && (
        <div>
          <div>Name: {currentAuction.name}</div>
          <div>Starting bid: {currentAuction.startingBid}</div>
          {currentAuction.closed && (
            <p>
              This auction's winner is {currentAuction.currentBidder} with $
              {currentAuction.currentBid}.
            </p>
          )}
          {!currentAuction.closed && (
            <>
              <h3>Time Remaining: {timeRemaining}</h3>
              <div>
                <input
                  type="number"
                  value={userBid}
                  onChange={onUserBidChange}
                />
                <button onClick={onPlaceBidClicked}>Place Bid</button>
                {error && <p>{error}</p>}
              </div>
              <div>
                Lead: <b>{currentAuction.currentBidder}</b>
              </div>
              <div>Current Bid: {currentAuction.currentBid}</div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

const auctionItems: AuctionItem[] = [
  { id: 1, name: "Vintage Camera", startingBid: 50 },
  { id: 2, name: "Antique Clock", startingBid: 120 },
  { id: 3, name: "Signed Guitar", startingBid: 300 },
];

type AuctionItem = {
  id: number;
  name: string;
  startingBid: number;
};

type BidItem = AuctionItem & {
  currentBid: number;
  currentBidder: "me" | "other" | "house";
  closed: boolean;
};
