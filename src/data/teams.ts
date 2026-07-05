interface Team {
  id: string;
  captainName: string;
  name: string;
  gradient:string;
  managerName: string;
  players:string[]
  logo: string;
}

const TEAMS: Team[] = [
  {
    id: "ss1", name: "Raider Warriors", logo: "RW",
    captainName: "Aadil Mir", managerName: "Farooq Ahmad",
    gradient: "from-purple-600 to-violet-900",
    players: ["Aadil Mir (C)", "Wasim Lone", "Tariq Bhat", "Arif Wani", "Sajad Rather", "Umar Sheikh", "Danish Malik", "Aamir Sofi", "Reyaz Zargar", "Mudasir Ganaie", "Bilal Dar", "Imran Mattoo"],
  },
  {
    id: "2", name: "Snow Leopards", logo: "SL",
    captainName: "Farhan Sheikh", managerName: "Nazir Ahmad",
    gradient: "from-blue-600 to-cyan-900",
    players: ["Farhan Sheikh (C)", "Adnan Lone", "Irfan Bhat", "Shakeel Wani", "Fayaz Rather", "Nawaz Malik", "Asif Sofi", "Manzoor Khan", "Altaf Zargar", "Javid Ganaie", "Niyaz Dar", "Firdous Mattoo"],
  },
  {
    id: "3", name: "Dal Defenders", logo: "DD",
    captainName: "Imran Lone", managerName: "Shabir Hussain",
    gradient: "from-indigo-600 to-blue-900",
    players: ["Imran Lone (C)", "Riyaz Bhat", "Nadeem Wani", "Bashir Rather", "Ghulam Malik", "Rafiq Sofi", "Dildar Khan", "Tawseef Zargar", "Suhail Ganaie", "Mehraj Dar", "Iqbal Mattoo", "Basharat Sheikh"],
  },
  {
    id: "4", name: "Himalayan Hawks", logo: "HH",
    captainName: "Bilal Wani", managerName: "Abdul Rashid",
    gradient: "from-violet-600 to-purple-900",
    players: ["Bilal Wani (C)", "Nabil Bhat", "Pervaiz Rather", "Showkat Malik", "Zahoor Sofi", "Latif Khan", "Shafiq Zargar", "Inayat Ganaie", "Bashir Dar", "Mukhtar Mattoo", "Arshad Sheikh", "Hafeez Lone"],
  },
  {
    id: "5", name: "Kashmir Thunder", logo: "KT",
    captainName: "Tariq Bhat", managerName: "Mohammad Yousuf",
    gradient: "from-sky-600 to-indigo-900",
    players: ["Tariq Bhat (C)", "Khalid Rather", "Nisar Malik", "Gulzar Sofi", "Mehboob Khan", "Shafaat Zargar", "Waqar Ganaie", "Aziz Dar", "Noor Mattoo", "Zaffar Sheikh", "Qaiser Lone", "Mansoor Wani"],
  },
  {
    id: "6", name: "Valley Vipers", logo: "VV",
    captainName: "Zubair Ganaie", managerName: "Ghulam Nabi",
    gradient: "from-teal-600 to-emerald-900",
    players: ["Zubair Ganaie (C)", "Sajid Dar", "Tanvir Mattoo", "Abrar Sheikh", "Mushtaq Lone", "Nazim Wani", "Aslam Bhat", "Suhel Rather", "Gowhar Malik", "Muzaffar Sofi", "Mujahid Khan", "Aftab Zargar"],
  },
  {
    id: "7", name: "Sopore Strikers", logo: "SS",
    captainName: "Shahid Dar", managerName: "Bashir Sofi",
    gradient: "from-orange-600 to-red-900",
    players: ["Shahid Dar (C)", "Irshad Mattoo", "Wasim Sheikh", "Aijaz Lone", "Akbar Wani", "Shabbir Bhat", "Naseer Rather", "Muneer Malik", "Tanveer Sofi", "Rafeeq Khan", "Shahzad Zargar", "Noman Ganaie"],
  },
  {
    id: "8", name: "North Star XI", logo: "NS",
    captainName: "Mudasir Khan", managerName: "Fareed Ahmad",
    gradient: "from-rose-600 to-pink-900",
    players: ["Mudasir Khan (C)", "Shaukat Zargar", "Riaz Ganaie", "Faisal Dar", "Kamran Mattoo", "Tariq Sheikh", "Hamid Lone", "Ajaz Wani", "Ashraf Bhat", "Nasir Rather", "Shariq Malik", "Tahir Sofi"],
  },
];

export default TEAMS;