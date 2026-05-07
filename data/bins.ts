export interface Bin {
  id: number;
  name: string;
  lat: number;
  lng: number;
  status: "overflow" | "available";
}

export const bins: Bin[] = [
  {
    id: 1,
    name: "Engineering Building Bin",
    lat: 8.4859,
    lng: 124.657,
    status: "overflow",
  },
  {
    id: 2,
    name: "Library Bin",
    lat: 8.4865,
    lng: 124.6558,
    status: "overflow",
  },
  {
    id: 3,
    name: "Canteen Bin",
    lat: 8.4849,
    lng: 124.6562,
    status: "overflow",
  },
  {
    id: 4,
    name: "Senior High Bin",
    lat: 8.4861381,
    lng: 124.6570198,
    status: "overflow",
  },
];
