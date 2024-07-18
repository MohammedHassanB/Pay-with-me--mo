import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectFriend, setSelectFriend] = useState(null);
  function handelSelectFriend(friend) {
    setSelectFriend((curFriend) =>
      curFriend?.id === friend.id ? null : friend
    );
    setShowAddFriend(false);
  }
  function handelShowAddForm() {
    setShowAddFriend((prevShowAddFriend) => !prevShowAddFriend);
  }
  function handelAddFriend(friend) {
    setFriends((prevfriends) => [...prevfriends, friend]);
    setShowAddFriend(false);
  }

  function handelSplitBill(value) {
    setFriends((prevFriend) =>
      prevFriend.map((friend) =>
        friend.id === selectFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectFriend(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelectFriend={handelSelectFriend}
          selectFriend={selectFriend}
        />
        {showAddFriend && <FormAddFriend onAddFriend={handelAddFriend} />}
        <Button onClick={handelShowAddForm}>
          {showAddFriend ? "Close" : "Add friend"}
        </Button>
      </div>
      {selectFriend && (
        <FormSplitBill
          friend={selectFriend}
          onSplitBill={handelSplitBill}
          key={selectFriend.id}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelectFriend, selectFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          key={friend.id}
          friend={friend}
          onSelectFriend={onSelectFriend}
          selectFriend={selectFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelectFriend, selectFriend }) {
  const isSelected = selectFriend?.id === friend?.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {-1 * friend.balance} €
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {friend.balance} €
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button onClick={() => onSelectFriend(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [friendName, setFriendName] = useState("");
  const [friendImage, setFriendImage] = useState("https://i.pravatar.cc/48");
  function handelSubmit(e) {
    e.preventDefault();
    if (!friendImage || !friendName) return;
    const id = crypto.randomUUID();
    const newFriend = {
      name: friendName,
      image: `${friendImage}?=${id}`,
      balance: 0,
      id,
    };
    onAddFriend(newFriend);
    setFriendName(() => "");
    setFriendImage(() => "https://i.pravatar.cc/48");
  }
  return (
    <form className="form-add-friend" onSubmit={handelSubmit}>
      <label>🧑‍🤝‍🧑Friend name</label>
      <input
        type="text"
        value={friendName}
        onChange={(e) => setFriendName(e.target.value)}
      />
      <label>📸 Image url</label>
      <input
        type="text"
        value={friendImage}
        onChange={(e) => setFriendImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ friend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setpaidByUser] = useState("");
  const paidByFriend = bill && paidByUser ? bill - paidByUser : "";
  const [whoPaid, setWhoPaid] = useState("user");
  function handelSubmit(e) {
    e.preventDefault();
    if (!bill || !paidByUser) return;
    onSplitBill(whoPaid === "user" ? paidByFriend : -paidByUser);
  }
  return (
    <form className="form-split-bill" onSubmit={handelSubmit}>
      <h2>Split a bill with {friend.name}</h2>
      <label>💸 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🧍 Your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setpaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />

      <label>🧑‍🤝‍🧑 {friend.name}`s expense</label>
      <input type="text" disabled value={paidByFriend} />

      <label>🤑 Bill belongs to</label>
      <select value={whoPaid} onChange={(e) => setWhoPaid(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{friend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}
