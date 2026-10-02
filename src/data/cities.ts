export type CityRoute = {
  pickup: string;
  drop: string;
  km: number;
};

export type City = {
  id: string;
  name: string;
  code: string;
  demand: string;
  routes: CityRoute[];
};

export const CITIES: City[] = [
  {
    id: "blr",
    name: "Bengaluru",
    code: "KA",
    demand: "High · IT corridor rush",
    routes: [
      { pickup: "Koramangala 5th Block", drop: "MG Road Metro", km: 6.8 },
      { pickup: "Indiranagar 100ft Rd", drop: "Kempegowda Airport T1", km: 34.2 },
      { pickup: "Whitefield Gate 1", drop: "Electronic City Phase 1", km: 28.5 },
      { pickup: "Jayanagar 4th Block", drop: "Manyata Tech Park", km: 17.4 },
    ],
  },
  {
    id: "del",
    name: "Delhi NCR",
    code: "DL",
    demand: "High · Metro feeder demand",
    routes: [
      { pickup: "Connaught Place", drop: "Cyber City Gurugram", km: 14.6 },
      { pickup: "Karol Bagh Market", drop: "Saket Select Citywalk", km: 11.2 },
      { pickup: "Rajouri Garden", drop: "Indira Gandhi Airport T3", km: 18.9 },
      { pickup: "Hauz Khas Village", drop: "Dwarka Sector 21", km: 16.3 },
    ],
  },
  {
    id: "mum",
    name: "Mumbai",
    code: "MH",
    demand: "Steady · Airport queue active",
    routes: [
      { pickup: "Bandra Kurla Complex", drop: "Lower Parel", km: 12.1 },
      { pickup: "Andheri East Metro", drop: "Chhatrapati Shivaji Airport T2", km: 9.4 },
      { pickup: "Powai Hiranandani", drop: "Bandra Bandstand", km: 15.8 },
      { pickup: "Dadar Circle", drop: "Juhu Beach", km: 10.6 },
    ],
  },
  {
    id: "hyd",
    name: "Hyderabad",
    code: "TS",
    demand: "High · Office commute",
    routes: [
      { pickup: "Hitec City Main Rd", drop: "Gachibowli Circle", km: 7.3 },
      { pickup: "Jubilee Hills Road 36", drop: "Banjara Hills Rd 12", km: 6.1 },
      { pickup: "LB Nagar", drop: "Rajiv Gandhi Airport", km: 29.7 },
      { pickup: "Ameerpet", drop: "HITEC City Metro", km: 8.9 },
    ],
  },
  {
    id: "pnq",
    name: "Pune",
    code: "MH",
    demand: "Steady · Student traffic",
    routes: [
      { pickup: "Baner Road", drop: "Hinjewadi Phase 1", km: 12.4 },
      { pickup: "Kharadi", drop: "Koregaon Park", km: 9.8 },
      { pickup: "Shivajinagar", drop: "Airport Lohegaon", km: 11.7 },
      { pickup: "Viman Nagar", drop: "Camp Road", km: 8.2 },
    ],
  },
  {
    id: "maa",
    name: "Chennai",
    code: "TN",
    demand: "Steady · Coastal corridor",
    routes: [
      { pickup: "T. Nagar", drop: "OMR Sholinganallur", km: 18.6 },
      { pickup: "Anna Nagar Tower", drop: "Guindy Metro", km: 10.9 },
      { pickup: "Adyar", drop: "Chennai Central", km: 12.8 },
      { pickup: "Velachery", drop: "Airport Terminal", km: 16.4 },
    ],
  },
  {
    id: "ccu",
    name: "Kolkata",
    code: "WB",
    demand: "Steady · Evening rush",
    routes: [
      { pickup: "Salt Lake Sector V", drop: "Park Street", km: 13.5 },
      { pickup: "New Town Action Area", drop: "Howrah Station", km: 19.2 },
      { pickup: "Gariahat Market", drop: "Esplanade", km: 7.6 },
      { pickup: "Behala Chowrasta", drop: "Alipore Zoo", km: 9.3 },
    ],
  },
];

export const RIDER_NAMES = [
  "Aarav Sharma",
  "Diya Nair",
  "Rohan Mehta",
  "Ishita Rao",
  "Kabir Singh",
  "Meera Iyer",
  "Arjun Verma",
  "Sana Khan",
  "Vikram Reddy",
  "Priya Das",
  "Nikhil Joshi",
  "Ananya Bose",
];

export const CAPTAIN_VEHICLES = [
  "Maruti Swift · KA-05 MZ 4471",
  "Hyundai i20 · DL-3C AF 8820",
  "Tata Nexon EV · MH-02 EV 1193",
  "Mahindra Bolero · TS-09 UX 6612",
  "Kia Sonet · MH-12 QJ 3390",
  "Honda City · TN-09 BL 7205",
];

export function cityById(id: string): City {
  return CITIES.find((city) => city.id === id) ?? CITIES[0];
}
