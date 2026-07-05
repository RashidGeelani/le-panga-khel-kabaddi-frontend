// const FIXTURES: Fixture[] = [
//   { id: 1, team1: "Raider Warriors", team2: "Snow Leopards", date: "18 Sep 2026", time: "10:00 AM", ground: "Ground A", status: "upcoming" },
//   { id: 2, team1: "Dal Defenders", team2: "Himalayan Hawks", date: "18 Sep 2026", time: "12:00 PM", ground: "Ground B", status: "upcoming" },
//   { id: 3, team1: "Kashmir Thunder", team2: "Valley Vipers", date: "18 Sep 2026", time: "2:00 PM", ground: "Ground A", status: "upcoming" },
//   { id: 4, team1: "Sopore Strikers", team2: "North Star XI", date: "18 Sep 2026", time: "4:00 PM", ground: "Ground B", status: "upcoming" },
//   { id: 5, team1: "Raider Warriors", team2: "Dal Defenders", date: "19 Sep 2026", time: "10:00 AM", ground: "Ground A", status: "upcoming" },
//   { id: 6, team1: "Snow Leopards", team2: "Himalayan Hawks", date: "19 Sep 2026", time: "12:00 PM", ground: "Ground B", status: "upcoming" },
//   { id: 7, team1: "Kashmir Thunder", team2: "North Star XI", date: "19 Sep 2026", time: "2:00 PM", ground: "Ground A", status: "upcoming" },
//   { id: 8, team1: "Valley Vipers", team2: "Sopore Strikers", date: "19 Sep 2026", time: "4:00 PM", ground: "Ground B", status: "upcoming" },
//   { id: 9, team1: "Sopore Strikers", team2: "Raider Warriors", date: "10 Sep 2026", time: "10:00 AM", ground: "Ground A", status: "completed", score1: "38", score2: "45", winner: "Raider Warriors" },
//   { id: 10, team1: "Snow Leopards", team2: "Valley Vipers", date: "10 Sep 2026", time: "12:00 PM", ground: "Ground B", status: "completed", score1: "42", score2: "36", winner: "Snow Leopards" },
//   { id: 11, team1: "Dal Defenders", team2: "North Star XI", date: "11 Sep 2026", time: "10:00 AM", ground: "Ground A", status: "completed", score1: "51", score2: "44", winner: "Dal Defenders" },
//   { id: 12, team1: "Himalayan Hawks", team2: "Kashmir Thunder", date: "11 Sep 2026", time: "12:00 PM", ground: "Ground B", status: "completed", score1: "39", score2: "47", winner: "Kashmir Thunder" },
// ];
interface Fixture {
  id: number;
  team1: string;
  team2: string;
  date: string;
  time: string;
  ground: string;
  status: "upcoming" | "completed";
  score1?: string;
  score2?: string;
  winner?: string;
}

const FIXTURES: Fixture[] = [
  {
    id: 1,
    team1: "Midline",
    team2: "Nowpora",
    date: "18 Sep 2026",
    time: "10:00 AM",
    ground: "Ground A",
    status: "upcoming",
  },
  {
    id: 2,
    team1: "Nowpora kc",
    team2: "CKC Dudran",
    date: "18 Sep 2026",
    time: "12:00 PM",
    ground: "Ground B",
    status: "upcoming",
  },
  {
    id: 3,
    team1: "FKC",
    team2: "Midline",
    date: "18 Sep 2026",
    time: "2:00 PM",
    ground: "Ground A",
    status: "upcoming",
  },
  {
    id: 4,
    team1: "Nowpora",
    team2: "CKC Dudran",
    date: "18 Sep 2026",
    time: "4:00 PM",
    ground: "Ground B",
    status: "upcoming",
  },
  {
    id: 5,
    team1: "FKC",
    team2: "Nowpora kc",
    date: "19 Sep 2026",
    time: "10:00 AM",
    ground: "Ground A",
    status: "upcoming",
  },
  {
    id: 6,
    team1: "Midline",
    team2: "CKC Dudran",
    date: "19 Sep 2026",
    time: "12:00 PM",
    ground: "Ground B",
    status: "upcoming",
  },

  // Completed Matches
  {
    id: 7,
    team1: "Midline",
    team2: "FKC",
    date: "10 Sep 2026",
    time: "10:00 AM",
    ground: "Ground A",
    status: "completed",
    score1: "38",
    score2: "45",
    winner: "FKC",
  },
  {
    id: 8,
    team1: "Nowpora",
    team2: "Nowpora kc",
    date: "10 Sep 2026",
    time: "12:00 PM",
    ground: "Ground B",
    status: "completed",
    score1: "42",
    score2: "36",
    winner: "Nowpora",
  },
  {
    id: 9,
    team1: "CKC Dudran",
    team2: "Midline",
    date: "11 Sep 2026",
    time: "10:00 AM",
    ground: "Ground A",
    status: "completed",
    score1: "51",
    score2: "44",
    winner: "CKC Dudran",
  },
  {
    id: 10,
    team1: "FKC",
    team2: "Nowpora",
    date: "11 Sep 2026",
    time: "12:00 PM",
    ground: "Ground B",
    status: "completed",
    score1: "39",
    score2: "47",
    winner: "Nowpora",
  },
];

export default FIXTURES;