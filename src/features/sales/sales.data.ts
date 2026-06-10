import { DEFAULT_SERVICES } from "./sales.constants";
import type { Job, SalesFilters, SalesSummary } from "./sales.types";

// ── 18 realistic job records ──────────────────────────────────────────────────

export const JOBS: Job[] = [
  {
    id: "j1",
    jobRef: "JOB-0001",
    createdAt: "2026-05-02T09:15:00Z",
    customerName: "Peter Kamau",
    customerPhone: "0712 345 678",
    customerEmail: "peter.kamau@gmail.com",
    carPlate: "KDA 123A",
    carMake: "Toyota",
    carModel: "Prado",
    carVariant: "J150 TX",
    carYear: 2019,
    serviceType: "Installation",
    services: [DEFAULT_SERVICES[0], DEFAULT_SERVICES[2]],
    products: [
      {
        productId: "ip1",
        productName: 'Alpine X-Series 12" Subwoofer',
        quantity: 1,
        unitPrice: 24000,
        lineTotal: 24000,
      },
      {
        productId: "ip3",
        productName: "JL Audio 4-Channel Amplifier XD400/4",
        quantity: 1,
        unitPrice: 36000,
        lineTotal: 36000,
      },
      {
        productId: "ip9",
        productName: "Stinger 8GA 20ft RCA Wiring Kit",
        quantity: 1,
        unitPrice: 4800,
        lineTotal: 4800,
      },
    ],
    productsSubtotal: 64800,
    servicesSubtotal: 6500,
    discount: 1300,
    grandTotal: 70000,
    paymentStatus: "Paid",
    paymentMethod: "Mpesa",
    mpesaRef: "QH7L2K9XP3",
    paymentDate: "2026-05-02T10:30:00Z",
    technicianName: "Brian",
    jobStatus: "Completed",
    installationNotes:
      "Installed Alpine X12 subwoofer in custom MDF box in boot, ran 4 gauge power cable through firewall, grounded to chassis bolt behind rear seat. JL Audio amp mounted under passenger seat.",
    difficultyRating: "Complex",
    followUpNeeded: false,
  },
  {
    id: "j2",
    jobRef: "JOB-0002",
    createdAt: "2026-05-04T11:00:00Z",
    customerName: "Faith Wanjiku",
    customerPhone: "0733 456 789",
    carPlate: "KBZ 456B",
    carMake: "Toyota",
    carModel: "Fielder",
    carVariant: "G 1.5",
    carYear: 2017,
    serviceType: "Installation",
    services: [DEFAULT_SERVICES[1]],
    products: [
      {
        productId: "ip2",
        productName: "Pioneer AVH-Z9250BT Double DIN",
        quantity: 1,
        unitPrice: 42000,
        lineTotal: 42000,
      },
    ],
    productsSubtotal: 42000,
    servicesSubtotal: 1500,
    discount: 0,
    grandTotal: 43500,
    paymentStatus: "Deposit Made",
    depositAmount: 20000,
    balanceRemaining: 23500,
    paymentMethod: "Mpesa",
    mpesaRef: "AB3C9D7EF1",
    paymentDate: "2026-05-04T11:45:00Z",
    technicianName: "Kevin",
    jobStatus: "Completed",
    installationNotes:
      "Pioneer double DIN fitted in OEM dash panel. Android auto and CarPlay tested and working. Reverse camera wired to reverse trigger.",
    difficultyRating: "Medium",
    followUpNeeded: true,
    followUpNotes: "Customer to come back for balance payment KES 23,500",
  },
  {
    id: "j3",
    jobRef: "JOB-0003",
    createdAt: "2026-05-06T14:30:00Z",
    customerName: "James Otieno",
    customerPhone: "0722 567 890",
    carPlate: "KCC 789C",
    carMake: "Toyota",
    carModel: "Axio",
    carVariant: "G",
    carYear: 2016,
    serviceType: "Correction",
    services: [DEFAULT_SERVICES[3]],
    products: [
      {
        productId: "ip9",
        productName: "Stinger 8GA 20ft RCA Wiring Kit",
        quantity: 2,
        unitPrice: 4800,
        lineTotal: 9600,
      },
    ],
    productsSubtotal: 9600,
    servicesSubtotal: 2000,
    discount: 0,
    grandTotal: 11600,
    paymentStatus: "Paid",
    paymentMethod: "Cash",
    paymentDate: "2026-05-06T16:00:00Z",
    technicianName: "James",
    jobStatus: "Completed",
    installationNotes:
      "Previous installer used wrong gauge wire causing amp clipping. Re-routed power cable through left side pillar, new RCA cables laid along door sill.",
    issuesEncountered: "Burnt 18AWG wire from previous job found under carpet",
    issuesResolution:
      "Removed faulty wiring entirely, replaced with 8 gauge throughout",
    difficultyRating: "Complex",
    followUpNeeded: false,
  },
  {
    id: "j4",
    jobRef: "JOB-0004",
    createdAt: "2026-05-08T09:00:00Z",
    customerName: "Mary Njeri",
    customerPhone: "0711 678 901",
    customerEmail: "mnjeri@outlook.com",
    carPlate: "KDE 321D",
    carMake: "VW",
    carModel: "Polo Vivo",
    carVariant: "1.4 Trendline",
    carYear: 2020,
    serviceType: "Installation",
    services: [DEFAULT_SERVICES[5]],
    products: [
      {
        productId: "ip4",
        productName: "Sony XS-FB6930 6x9 Speakers",
        quantity: 1,
        unitPrice: 7800,
        lineTotal: 7800,
      },
      {
        productId: "ip10",
        productName: 'Kenwood KFC-E174 6.5" Tweeters',
        quantity: 1,
        unitPrice: 4200,
        lineTotal: 4200,
      },
    ],
    productsSubtotal: 12000,
    servicesSubtotal: 1000,
    discount: 500,
    grandTotal: 12500,
    paymentStatus: "Paid",
    paymentMethod: "Card",
    paymentDate: "2026-05-08T10:15:00Z",
    technicianName: "Mercy",
    jobStatus: "Completed",
    installationNotes:
      "Sony 6x9 fitted in rear parcel shelf custom brackets. Kenwood tweeters mounted in A-pillars using factory tweeter locations.",
    difficultyRating: "Easy",
    followUpNeeded: false,
  },
  {
    id: "j5",
    jobRef: "JOB-0005",
    createdAt: "2026-05-10T10:30:00Z",
    customerName: "Samuel Kiptoo",
    customerPhone: "0700 789 012",
    carPlate: "KBF 555E",
    carMake: "Subaru",
    carModel: "Forester",
    carVariant: "2.0 XT",
    carYear: 2018,
    serviceType: "Upgrade",
    services: [DEFAULT_SERVICES[0]],
    products: [
      {
        productId: "ip2",
        productName: "Pioneer AVH-Z9250BT Double DIN",
        quantity: 1,
        unitPrice: 42000,
        lineTotal: 42000,
      },
      {
        productId: "ip6",
        productName: 'Alpine SPG-17CS 6.5" Component Kit',
        quantity: 2,
        unitPrice: 13500,
        lineTotal: 27000,
      },
      {
        productId: "ip1",
        productName: 'Alpine X-Series 12" Subwoofer',
        quantity: 1,
        unitPrice: 24000,
        lineTotal: 24000,
      },
    ],
    productsSubtotal: 93000,
    servicesSubtotal: 4000,
    discount: 2000,
    grandTotal: 95000,
    paymentStatus: "Paid",
    paymentMethod: "Bank Transfer",
    paymentDate: "2026-05-10T14:00:00Z",
    technicianName: "Brian",
    jobStatus: "Completed",
    installationNotes:
      "Full system upgrade on Subaru Forester. Pioneer head unit replaced OEM Fujitsu unit. Alpine components in front doors with kickpanel adapters. Subwoofer in sealed enclosure in boot, retained all safety equipment access.",
    difficultyRating: "Complex",
    followUpNeeded: false,
  },
  {
    id: "j6",
    jobRef: "JOB-0006",
    createdAt: "2026-05-12T08:45:00Z",
    customerName: "Diana Omondi",
    customerPhone: "0720 890 123",
    carPlate: "KAA 101F",
    carMake: "Nissan",
    carModel: "X-Trail",
    carVariant: "2.0 CVT",
    carYear: 2019,
    serviceType: "Diagnostic",
    services: [DEFAULT_SERVICES[4]],
    products: [],
    productsSubtotal: 0,
    servicesSubtotal: 500,
    discount: 0,
    grandTotal: 500,
    paymentStatus: "Paid",
    paymentMethod: "Cash",
    paymentDate: "2026-05-12T09:30:00Z",
    technicianName: "Kevin",
    jobStatus: "Follow Up Needed",
    installationNotes:
      "Ran diagnostic on audio system. Head unit intermittently cuts audio on left channel.",
    issuesEncountered:
      "Loose speaker wire connection at head unit harness — left front speaker",
    issuesResolution:
      "Reseated connector, taped with self-amalgamating tape. Recommend full component replacement on next visit",
    difficultyRating: "Easy",
    followUpNeeded: true,
    followUpNotes:
      "Customer to return for full front speaker replacement — quoted KES 25,000",
  },
  {
    id: "j7",
    jobRef: "JOB-0007",
    createdAt: "2026-05-14T13:00:00Z",
    customerName: "Alex Mwenda",
    customerPhone: "0798 901 234",
    carPlate: "KCG 777G",
    carMake: "Toyota",
    carModel: "Hilux",
    carVariant: "GD-6 2.8",
    carYear: 2021,
    serviceType: "Installation",
    services: [DEFAULT_SERVICES[0], DEFAULT_SERVICES[5]],
    products: [
      {
        productId: "ip5",
        productName: "Kenwood KDC-BT950DAB Head Unit",
        quantity: 1,
        unitPrice: 19500,
        lineTotal: 19500,
      },
      {
        productId: "ip8",
        productName: 'JL Audio C2-650X 6.5" Coaxial',
        quantity: 2,
        unitPrice: 11000,
        lineTotal: 22000,
      },
      {
        productId: "ip9",
        productName: "Stinger 8GA 20ft RCA Wiring Kit",
        quantity: 1,
        unitPrice: 4800,
        lineTotal: 4800,
      },
    ],
    productsSubtotal: 46300,
    servicesSubtotal: 5000,
    discount: 800,
    grandTotal: 50500,
    paymentStatus: "Paid",
    paymentMethod: "Mpesa",
    mpesaRef: "GH4M8N2PQ5",
    paymentDate: "2026-05-14T15:30:00Z",
    technicianName: "Brian",
    jobStatus: "Completed",
    installationNotes:
      "Kenwood head unit fitted. JL Audio coaxials in both front doors. RCA wiring run along passenger side carpet edge.",
    difficultyRating: "Medium",
    followUpNeeded: false,
  },
  {
    id: "j8",
    jobRef: "JOB-0008",
    createdAt: "2026-05-16T10:00:00Z",
    customerName: "Lilian Chebet",
    customerPhone: "0737 012 345",
    carPlate: "KBH 999H",
    carMake: "Mazda",
    carModel: "Demio",
    carVariant: "1.3 Active",
    carYear: 2018,
    serviceType: "Product Only",
    services: [DEFAULT_SERVICES[6]],
    products: [
      {
        productId: "ip4",
        productName: "Sony XS-FB6930 6x9 Speakers",
        quantity: 1,
        unitPrice: 7800,
        lineTotal: 7800,
      },
    ],
    productsSubtotal: 7800,
    servicesSubtotal: 0,
    discount: 0,
    grandTotal: 7800,
    paymentStatus: "Unpaid",
    paymentMethod: "Cash",
    paymentDate: "2026-05-16T10:00:00Z",
    technicianName: "Mercy",
    jobStatus: "Pending",
    installationNotes: "Customer taking product for self-installation.",
    difficultyRating: "Easy",
    followUpNeeded: false,
  },
  {
    id: "j9",
    jobRef: "JOB-0009",
    createdAt: "2026-05-18T09:30:00Z",
    customerName: "Robert Githinji",
    customerPhone: "0724 123 456",
    customerEmail: "r.githinji@gmail.com",
    carPlate: "KDJ 222J",
    carMake: "BMW",
    carModel: "X3",
    carVariant: "xDrive 20i",
    carYear: 2020,
    serviceType: "Upgrade",
    services: [DEFAULT_SERVICES[0], DEFAULT_SERVICES[2]],
    products: [
      {
        productId: "ip3",
        productName: "JL Audio 4-Channel Amplifier XD400/4",
        quantity: 1,
        unitPrice: 36000,
        lineTotal: 36000,
      },
      {
        productId: "ip6",
        productName: 'Alpine SPG-17CS 6.5" Component Kit',
        quantity: 2,
        unitPrice: 13500,
        lineTotal: 27000,
      },
      {
        productId: "ip7",
        productName: 'Pioneer TS-SW3002S4 12" Shallow Sub',
        quantity: 1,
        unitPrice: 17000,
        lineTotal: 17000,
      },
    ],
    productsSubtotal: 80000,
    servicesSubtotal: 6500,
    discount: 0,
    grandTotal: 86500,
    paymentStatus: "Deposit Made",
    depositAmount: 50000,
    balanceRemaining: 36500,
    paymentMethod: "Bank Transfer",
    paymentDate: "2026-05-18T10:00:00Z",
    technicianName: "Brian",
    jobStatus: "In Progress",
    installationNotes:
      "BMW X3 — OEM HIFI system retained, adding JL amp and Pioneer shallow sub under boot floor. Component kit in doors using OEM speaker locations.",
    issuesEncountered:
      "CAN bus integration required for amp remote turn-on signal",
    difficultyRating: "Complex",
    followUpNeeded: true,
    followUpNotes:
      "Balance KES 36,500 on collection. Check CANBUS module compatibility before next session.",
  },
  {
    id: "j10",
    jobRef: "JOB-0010",
    createdAt: "2026-05-20T11:15:00Z",
    customerName: "Grace Achieng",
    customerPhone: "0715 234 567",
    carPlate: "KAK 444K",
    carMake: "Toyota",
    carModel: "Vitz",
    carVariant: "F 1.0",
    carYear: 2016,
    serviceType: "Installation",
    services: [DEFAULT_SERVICES[1]],
    products: [
      {
        productId: "ip5",
        productName: "Kenwood KDC-BT950DAB Head Unit",
        quantity: 1,
        unitPrice: 19500,
        lineTotal: 19500,
      },
    ],
    productsSubtotal: 19500,
    servicesSubtotal: 1500,
    discount: 0,
    grandTotal: 21000,
    paymentStatus: "Paid",
    paymentMethod: "Mpesa",
    mpesaRef: "TJ5R1K8LM9",
    paymentDate: "2026-05-20T12:00:00Z",
    technicianName: "Kevin",
    jobStatus: "Completed",
    installationNotes:
      "Kenwood single DIN with Bluetooth fitted. Steering wheel controls adaptor installed.",
    difficultyRating: "Easy",
    followUpNeeded: false,
  },
  {
    id: "j11",
    jobRef: "JOB-0011",
    createdAt: "2026-05-22T14:00:00Z",
    customerName: "Hassan Mwaro",
    customerPhone: "0741 345 678",
    carPlate: "KBL 666L",
    carMake: "Toyota",
    carModel: "Land Cruiser",
    carVariant: "V8 4.6 VX",
    carYear: 2018,
    serviceType: "Installation",
    services: [DEFAULT_SERVICES[0], DEFAULT_SERVICES[2]],
    products: [
      {
        productId: "ip2",
        productName: "Pioneer AVH-Z9250BT Double DIN",
        quantity: 1,
        unitPrice: 42000,
        lineTotal: 42000,
      },
      {
        productId: "ip1",
        productName: 'Alpine X-Series 12" Subwoofer',
        quantity: 2,
        unitPrice: 24000,
        lineTotal: 48000,
      },
      {
        productId: "ip3",
        productName: "JL Audio 4-Channel Amplifier XD400/4",
        quantity: 2,
        unitPrice: 36000,
        lineTotal: 72000,
      },
      {
        productId: "ip9",
        productName: "Stinger 8GA 20ft RCA Wiring Kit",
        quantity: 2,
        unitPrice: 4800,
        lineTotal: 9600,
      },
    ],
    productsSubtotal: 171600,
    servicesSubtotal: 6500,
    discount: 12100,
    grandTotal: 166000,
    paymentStatus: "Paid",
    paymentMethod: "Bank Transfer",
    paymentDate: "2026-05-22T16:00:00Z",
    technicianName: "Brian",
    jobStatus: "Completed",
    installationNotes:
      "Full premium install on LC V8. Dual Alpine subs in custom ported box, dual JL amps in separate amp rack in boot. Pioneer HU with FLAC playback. Deadened all four doors with Second Skin.",
    difficultyRating: "Complex",
    followUpNeeded: false,
  },
  {
    id: "j12",
    jobRef: "JOB-0012",
    createdAt: "2026-05-24T09:00:00Z",
    customerName: "Beatrice Waweru",
    customerPhone: "0758 456 789",
    carPlate: "KCM 888M",
    carMake: "Subaru",
    carModel: "Legacy",
    carVariant: "2.5 GT",
    carYear: 2017,
    serviceType: "Correction",
    services: [DEFAULT_SERVICES[3]],
    products: [
      {
        productId: "ip9",
        productName: "Stinger 8GA 20ft RCA Wiring Kit",
        quantity: 1,
        unitPrice: 4800,
        lineTotal: 4800,
      },
    ],
    productsSubtotal: 4800,
    servicesSubtotal: 2000,
    discount: 0,
    grandTotal: 6800,
    paymentStatus: "Paid",
    paymentMethod: "Cash",
    paymentDate: "2026-05-24T11:00:00Z",
    technicianName: "James",
    jobStatus: "Completed",
    installationNotes:
      "Corrected ground loop causing hissing noise. RCA cables replaced and re-routed away from power cable.",
    issuesEncountered:
      "RCA cables running parallel to power cable causing hum interference",
    issuesResolution:
      "Routed RCA cables through opposite side of vehicle, noise eliminated",
    difficultyRating: "Medium",
    followUpNeeded: false,
  },
  {
    id: "j13",
    jobRef: "JOB-0013",
    createdAt: "2026-05-27T10:30:00Z",
    customerName: "Collins Mutua",
    customerPhone: "0763 567 890",
    carPlate: "KDN 333N",
    carMake: "Nissan",
    carModel: "Note",
    carVariant: "e-Power 1.2",
    carYear: 2019,
    serviceType: "Installation",
    services: [DEFAULT_SERVICES[1], DEFAULT_SERVICES[5]],
    products: [
      {
        productId: "ip2",
        productName: "Pioneer AVH-Z9250BT Double DIN",
        quantity: 1,
        unitPrice: 42000,
        lineTotal: 42000,
      },
      {
        productId: "ip8",
        productName: 'JL Audio C2-650X 6.5" Coaxial',
        quantity: 2,
        unitPrice: 11000,
        lineTotal: 22000,
      },
    ],
    productsSubtotal: 64000,
    servicesSubtotal: 2500,
    discount: 500,
    grandTotal: 66000,
    paymentStatus: "Unpaid",
    paymentMethod: "Mpesa",
    paymentDate: "2026-05-27T10:30:00Z",
    technicianName: "Kevin",
    jobStatus: "Completed",
    installationNotes:
      "Pioneer HU and JL coaxials installed. Nissan Note requires custom fascia adapter for double DIN.",
    difficultyRating: "Medium",
    followUpNeeded: true,
    followUpNotes: "Awaiting full payment KES 66,000",
  },
  {
    id: "j14",
    jobRef: "JOB-0014",
    createdAt: "2026-05-29T08:30:00Z",
    customerName: "Stella Maina",
    customerPhone: "0701 678 901",
    carPlate: "KBO 111P",
    carMake: "Toyota",
    carModel: "Corolla",
    carVariant: "1.8 Axio Hybrid",
    carYear: 2015,
    serviceType: "Warranty Job",
    services: [DEFAULT_SERVICES[3]],
    products: [],
    productsSubtotal: 0,
    servicesSubtotal: 0,
    discount: 0,
    grandTotal: 0,
    paymentStatus: "Paid",
    paymentMethod: "Cash",
    paymentDate: "2026-05-29T09:00:00Z",
    technicianName: "James",
    jobStatus: "Completed",
    installationNotes:
      "Warranty revisit — head unit display intermittent. Resolved connector issue at back of unit.",
    issuesEncountered: "Loose LVDS ribbon cable causing display flicker",
    issuesResolution:
      "Reseated LVDS cable and secured with cable tie to prevent vibration movement",
    difficultyRating: "Easy",
    followUpNeeded: false,
  },
  {
    id: "j15",
    jobRef: "JOB-0015",
    createdAt: "2026-06-02T11:00:00Z",
    customerName: "Michael Ochieng",
    customerPhone: "0745 789 012",
    customerEmail: "m.ochieng@gmail.com",
    carPlate: "KCP 999Q",
    carMake: "VW",
    carModel: "Golf GTI",
    carVariant: "Mk7 2.0 TSI",
    carYear: 2019,
    serviceType: "Upgrade",
    services: [DEFAULT_SERVICES[0], DEFAULT_SERVICES[5]],
    products: [
      {
        productId: "ip6",
        productName: 'Alpine SPG-17CS 6.5" Component Kit',
        quantity: 2,
        unitPrice: 13500,
        lineTotal: 27000,
      },
      {
        productId: "ip3",
        productName: "JL Audio 4-Channel Amplifier XD400/4",
        quantity: 1,
        unitPrice: 36000,
        lineTotal: 36000,
      },
      {
        productId: "ip10",
        productName: 'Kenwood KFC-E174 6.5" Tweeters',
        quantity: 2,
        unitPrice: 4200,
        lineTotal: 8400,
      },
    ],
    productsSubtotal: 71400,
    servicesSubtotal: 5000,
    discount: 1400,
    grandTotal: 75000,
    paymentStatus: "Deposit Made",
    depositAmount: 30000,
    balanceRemaining: 45000,
    paymentMethod: "Mpesa",
    mpesaRef: "PK9X3H7YT4",
    paymentDate: "2026-06-02T11:30:00Z",
    technicianName: "Brian",
    jobStatus: "In Progress",
    installationNotes:
      "Stage 2 audio upgrade on Golf GTI. Alpine components in doors, JL amp in boot. Tweeter pods fabricated in A-pillar.",
    difficultyRating: "Complex",
    followUpNeeded: false,
  },
  {
    id: "j16",
    jobRef: "JOB-0016",
    createdAt: "2026-06-03T09:00:00Z",
    customerName: "Kevin Njoroge",
    customerPhone: "0730 890 123",
    carPlate: "KDQ 222R",
    carMake: "Toyota",
    carModel: "RAV4",
    carVariant: "2.0 Hybrid",
    carYear: 2020,
    serviceType: "Installation",
    services: [DEFAULT_SERVICES[1]],
    products: [
      {
        productId: "ip2",
        productName: "Pioneer AVH-Z9250BT Double DIN",
        quantity: 1,
        unitPrice: 42000,
        lineTotal: 42000,
      },
    ],
    productsSubtotal: 42000,
    servicesSubtotal: 1500,
    discount: 0,
    grandTotal: 43500,
    paymentStatus: "Paid",
    paymentMethod: "Mpesa",
    mpesaRef: "WN8P4V6RS2",
    paymentDate: "2026-06-03T10:30:00Z",
    technicianName: "Mercy",
    jobStatus: "Completed",
    installationNotes:
      "Pioneer HU fitted in RAV4 using TYT002 fascia adapter. CarPlay and Android Auto tested.",
    difficultyRating: "Medium",
    followUpNeeded: false,
  },
  {
    id: "j17",
    jobRef: "JOB-0017",
    createdAt: "2026-06-04T10:00:00Z",
    customerName: "Patricia Kamando",
    customerPhone: "0719 901 234",
    customerEmail: "p.kamando@yahoo.com",
    carPlate: "KAR 777S",
    carMake: "Mazda",
    carModel: "CX-5",
    carVariant: "2.2 SKYACTIV-D",
    carYear: 2021,
    serviceType: "Installation",
    services: [DEFAULT_SERVICES[0], DEFAULT_SERVICES[2], DEFAULT_SERVICES[5]],
    products: [
      {
        productId: "ip1",
        productName: 'Alpine X-Series 12" Subwoofer',
        quantity: 1,
        unitPrice: 24000,
        lineTotal: 24000,
      },
      {
        productId: "ip3",
        productName: "JL Audio 4-Channel Amplifier XD400/4",
        quantity: 1,
        unitPrice: 36000,
        lineTotal: 36000,
      },
      {
        productId: "ip8",
        productName: 'JL Audio C2-650X 6.5" Coaxial',
        quantity: 2,
        unitPrice: 11000,
        lineTotal: 22000,
      },
      {
        productId: "ip9",
        productName: "Stinger 8GA 20ft RCA Wiring Kit",
        quantity: 1,
        unitPrice: 4800,
        lineTotal: 4800,
      },
    ],
    productsSubtotal: 86800,
    servicesSubtotal: 7500,
    discount: 1800,
    grandTotal: 92500,
    paymentStatus: "Unpaid",
    paymentMethod: "Bank Transfer",
    paymentDate: "2026-06-04T10:00:00Z",
    technicianName: "Brian",
    jobStatus: "In Progress",
    installationNotes:
      "Premium install on CX-5. Subwoofer box built under boot floor. JL Audio amp mounted beside spare wheel well. Coaxials replace factory front speakers.",
    difficultyRating: "Complex",
    followUpNeeded: false,
  },
  {
    id: "j18",
    jobRef: "JOB-0018",
    createdAt: "2026-06-05T09:30:00Z",
    customerName: "Dennis Kariuki",
    customerPhone: "0726 012 345",
    carPlate: "KBS 444T",
    carMake: "Honda",
    carModel: "CR-V",
    carVariant: "2.4 AWD",
    carYear: 2018,
    serviceType: "Installation",
    services: [DEFAULT_SERVICES[1], DEFAULT_SERVICES[5]],
    products: [
      {
        productId: "ip5",
        productName: "Kenwood KDC-BT950DAB Head Unit",
        quantity: 1,
        unitPrice: 19500,
        lineTotal: 19500,
      },
      {
        productId: "ip4",
        productName: "Sony XS-FB6930 6x9 Speakers",
        quantity: 1,
        unitPrice: 7800,
        lineTotal: 7800,
      },
    ],
    productsSubtotal: 27300,
    servicesSubtotal: 2500,
    discount: 0,
    grandTotal: 29800,
    paymentStatus: "Paid",
    paymentMethod: "Cash",
    paymentDate: "2026-06-05T11:00:00Z",
    technicianName: "Kevin",
    jobStatus: "Completed",
    installationNotes:
      "Kenwood HU and Sony rear speakers installed on CR-V. Used Honda-specific wiring harness adaptor.",
    difficultyRating: "Easy",
    followUpNeeded: false,
  },
];

// ── Computed helpers ──────────────────────────────────────────────────────────

export function calcSalesSummary(jobs: Job[]): SalesSummary {
  const today = new Date("2026-06-05");
  const monthStart = new Date("2026-06-01");

  let totalSalesMonth = 0;
  let paidCount = 0;
  let paidValue = 0;
  let unpaidCount = 0;
  let unpaidValue = 0;
  let depositCount = 0;
  let depositBalance = 0;
  let completedToday = 0;

  for (const job of jobs) {
    const jobDate = new Date(job.createdAt);

    if (jobDate >= monthStart) {
      totalSalesMonth += job.grandTotal;
    }

    if (job.paymentStatus === "Paid") {
      paidCount++;
      paidValue += job.grandTotal;
    } else if (job.paymentStatus === "Unpaid") {
      unpaidCount++;
      unpaidValue += job.grandTotal;
    } else if (job.paymentStatus === "Deposit Made") {
      depositCount++;
      depositBalance += job.balanceRemaining ?? 0;
    }

    const isToday =
      jobDate.toISOString().slice(0, 10) === today.toISOString().slice(0, 10);
    if (isToday && job.jobStatus === "Completed") {
      completedToday++;
    }
  }

  return {
    totalSalesMonth,
    paidCount,
    paidValue,
    unpaidCount,
    unpaidValue,
    depositCount,
    depositBalance,
    completedToday,
  };
}

export function filterJobs(jobs: Job[], filters: SalesFilters): Job[] {
  return jobs.filter((job) => {
    const q = filters.search.toLowerCase();
    if (
      q &&
      !job.customerName.toLowerCase().includes(q) &&
      !job.carPlate.toLowerCase().includes(q) &&
      !job.jobRef.toLowerCase().includes(q)
    ) {
      return false;
    }

    if (
      filters.paymentStatus !== "All" &&
      filters.paymentStatus !== "" &&
      job.paymentStatus !== filters.paymentStatus
    ) {
      return false;
    }

    if (
      filters.serviceType !== "All" &&
      filters.serviceType !== "" &&
      job.serviceType !== filters.serviceType
    ) {
      return false;
    }

    if (
      filters.jobStatus !== "All" &&
      filters.jobStatus !== "" &&
      job.jobStatus !== filters.jobStatus
    ) {
      return false;
    }

    if (
      filters.carMake !== "All Makes" &&
      filters.carMake !== "All" &&
      filters.carMake !== "" &&
      job.carMake !== filters.carMake
    ) {
      return false;
    }

    if (
      filters.technician !== "All" &&
      filters.technician !== "" &&
      job.technicianName !== filters.technician
    ) {
      return false;
    }

    if (filters.dateFrom) {
      if (new Date(job.createdAt) < new Date(filters.dateFrom)) return false;
    }
    if (filters.dateTo) {
      if (new Date(job.createdAt) > new Date(filters.dateTo + "T23:59:59Z"))
        return false;
    }

    return true;
  });
}
