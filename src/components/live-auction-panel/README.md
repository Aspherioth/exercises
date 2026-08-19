# React Live Auction Panel

Build a component that simulates a live auction for a single item at a time, with the ability to switch between different auction items.

Starting point: assume a basic shell with a dropdown/selector for choosing an auction item (mock data below), a display area, and a bid input + button.

Mock data:

```javascript
const auctionItems = [
  { id: 1, name: "Vintage Camera", startingBid: 50 },
  { id: 2, name: "Antique Clock", startingBid: 120 },
  { id: 3, name: "Signed Guitar", startingBid: 300 },
];
```

Requirements:

- A dropdown lets the user pick which item's auction to view. Switching items should reset to that item's current state (starting bid, fresh timer).
- Each auction has a **10-second countdown timer** that ticks down once per second and displays the time remaining. When it hits 0, show "Auction Ended" and disable bidding.
- Every 3 seconds, simulate a **competing bid** coming in automatically: bump the current highest bid up by a random amount ($5-$20) and display who "won" that round (just use the label "Other bidder").
- The user can enter a bid amount and click "Place Bid." The bid is only accepted if it's **strictly higher than the current highest bid at the moment the button is clicked** — if someone else's simulated bid beat them to it in the meantime, reject it with a message: "Bid too low, current highest is $X."
- If the user switches to a different auction item mid-countdown, all timers/intervals tied to the previous item must stop completely. No leftover ticking, no leftover competing-bid simulation from an item you've navigated away from.
- When the countdown hits 0, all bidding and the competing-bid simulation for that item should stop, even if the user stays on that item's view.
