import {
  User,
  Worker,
  Society,
  Skill,
  Booking,
  Payment,
  Rating,
  Certificate,
  Welfare,
  NotificationItem,
  SkillLevel,
  AvailabilityStatus
} from '../types';

export function calculateSkillScore(completedJobs: number, averageRating: number, onTimePercentage: number): { score: number; level: SkillLevel } {
  // Score formula: Completed Jobs * Average Rating * (On-Time % / 100)
  // Normalized for display: base points + performance multiplier
  const rawScore = completedJobs * averageRating * (onTimePercentage / 100);
  const normalizedScore = Math.min(100, Math.round((rawScore / 300) * 100));

  let level: SkillLevel = 'BRONZE';
  if (completedJobs >= 100 && averageRating >= 4.7 && onTimePercentage >= 90) {
    level = 'MASTER';
  } else if (completedJobs >= 40 && averageRating >= 4.4 && onTimePercentage >= 85) {
    level = 'GOLD';
  } else if (completedJobs >= 15 && averageRating >= 4.0) {
    level = 'SILVER';
  }

  return { score: normalizedScore, level };
}

class DatabaseStore {
  public users: Map<string, User> = new Map();
  public workers: Map<string, Worker> = new Map();
  public societies: Map<string, Society> = new Map();
  public skills: Map<string, Skill> = new Map();
  public bookings: Map<string, Booking> = new Map();
  public payments: Map<string, Payment> = new Map();
  public ratings: Map<string, Rating> = new Map();
  public certificates: Map<string, Certificate> = new Map();
  public welfareRecords: Map<string, Welfare> = new Map();
  public notifications: Map<string, NotificationItem> = new Map();
  public demandHistory: { date: string; service: string; requests: number; zone: string }[] = [];

  constructor() {
    this.seed();
  }

  private seed() {
    // 1. Master Skills
    const skillsList: Skill[] = [
      { id: 'sk-elec', name: 'Electrician', category: 'Electrical & Wiring', icon: 'Zap', description: 'Wiring, switchboard repair, appliance installation, MCB & fuse repair', basePrice: 299 },
      { id: 'sk-plumb', name: 'Plumber', category: 'Plumbing & Sanitation', icon: 'Wrench', description: 'Pipe leakage, tap fitting, bathroom sanitary repair, water motor setup', basePrice: 249 },
      { id: 'sk-carp', name: 'Carpenter', category: 'Woodwork & Furniture', icon: 'Hammer', description: 'Furniture repair, modular fittings, doors and locks repair, woodwork polish', basePrice: 349 },
      { id: 'sk-paint', name: 'Painter', category: 'Home Improvement', icon: 'Paintbrush', description: 'Interior & exterior wall painting, waterproof coating, wall putty', basePrice: 499 },
      { id: 'sk-clean', name: 'Cleaner', category: 'Sanitation & Hygiene', icon: 'Sparkles', description: 'Deep home cleaning, kitchen & bathroom sanitation, sofa cleaning', basePrice: 399 },
      { id: 'sk-gard', name: 'Gardener', category: 'Home & Outdoors', icon: 'Sprout', description: 'Lawn maintenance, trimming, potting, plant disease care, landscaping', basePrice: 249 },
      { id: 'sk-driv', name: 'Driver', category: 'Mobility & Transport', icon: 'Car', description: 'Personal driver, city trips, outstation travel, commercial vehicle driving', basePrice: 450 },
      { id: 'sk-care', name: 'Caregiver', category: 'Health & Senior Care', icon: 'HeartPulse', description: 'Elderly assistance, post-hospitalization patient care, physiotherapy aid', basePrice: 599 },
      { id: 'sk-dom', name: 'Domestic Helper', category: 'Household Assistance', icon: 'Home', description: 'Daily housekeeping, utensil cleaning, meal prep assistance, laundry aid', basePrice: 299 },
      { id: 'sk-ac', name: 'AC Technician', category: 'Appliance & Cooling', icon: 'Snowflake', description: 'AC servicing, gas refilling, cooling coil repair, split/window installation', basePrice: 499 },
      { id: 'sk-app', name: 'Appliance Repair', category: 'Appliance & Cooling', icon: 'Cpu', description: 'Washing machine, refrigerator, microwave and inverter repair', basePrice: 399 },
      { id: 'sk-tech', name: 'General Technician', category: 'Technical Support', icon: 'Settings', description: 'CCTV setup, Wi-Fi networking, smart home automation, TV mounting', basePrice: 350 }
    ];
    skillsList.forEach(s => this.skills.set(s.id, s));

    // 2. Societies
    const societiesList: Society[] = [
      {
        id: 'soc-varanasi',
        name: 'Varanasi Labour & Artisan Cooperative Society',
        registrationNumber: 'UP-VAR-COOP-2018-091',
        district: 'Varanasi',
        state: 'Uttar Pradesh',
        address: 'Godowlia Road, Near Dashashwamedh, Varanasi 221001',
        adminId: 'usr-admin-1',
        verificationStatus: 'VERIFIED',
        memberCount: 420,
        phone: '+91 542 2450192'
      },
      {
        id: 'soc-kashi',
        name: 'Kashi Technicians & Service Sahakari Samiti',
        registrationNumber: 'UP-VAR-COOP-2020-142',
        district: 'Varanasi',
        state: 'Uttar Pradesh',
        address: 'Sigra Mahmoorganj Marg, Varanasi 221010',
        adminId: 'usr-admin-2',
        verificationStatus: 'VERIFIED',
        memberCount: 285,
        phone: '+91 542 2781033'
      },
      {
        id: 'soc-purvanchal',
        name: 'Purvanchal Shramik Seva Federation',
        registrationNumber: 'UP-ST-FED-2016-004',
        district: 'Varanasi',
        state: 'Uttar Pradesh',
        address: 'Cantonment Area, Orderly Bazaar, Varanasi 221002',
        adminId: 'usr-admin-3',
        verificationStatus: 'VERIFIED',
        memberCount: 1150,
        phone: '+91 542 2229988'
      }
    ];
    societiesList.forEach(s => this.societies.set(s.id, s));

    // 3. Admin Users
    const admins: User[] = [
      {
        id: 'usr-admin-1',
        name: 'Dr. Rajesh Tripathi (Society Admin)',
        phone: '7777777777', // DEMO ADMIN
        email: 'admin@varanasicoop.org',
        passwordHash: '$2a$10$demoHashAdmin1234567890',
        role: 'SOCIETY_ADMIN',
        profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        language: 'en',
        createdAt: '2023-01-15T09:00:00Z'
      },
      {
        id: 'usr-admin-2',
        name: 'Smt. Vandana Mishra',
        phone: '7777777778',
        email: 'vandana@kashisamiti.in',
        passwordHash: '$2a$10$demoHashAdmin1234567890',
        role: 'SOCIETY_ADMIN',
        profilePhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
        language: 'hi',
        createdAt: '2023-03-20T10:00:00Z'
      },
      {
        id: 'usr-admin-3',
        name: 'Federation Commissioner Sharma',
        phone: '7777777779',
        email: 'commissioner@purvanchalfederation.gov.in',
        passwordHash: '$2a$10$demoHashAdmin1234567890',
        role: 'FEDERATION_ADMIN',
        profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        language: 'en',
        createdAt: '2022-11-10T08:30:00Z'
      }
    ];
    admins.forEach(a => this.users.set(a.id, a));

    // 4. Demo Customers (10)
    const customers: User[] = [
      {
        id: 'usr-cust-1',
        name: 'Sunita Sharma',
        phone: '9999999999', // DEMO CUSTOMER
        email: 'sunita.sharma@example.com',
        passwordHash: '$2a$10$demoHashCust1234567890',
        role: 'CUSTOMER',
        profilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
        language: 'en',
        createdAt: '2024-01-10T11:00:00Z'
      },
      {
        id: 'usr-cust-2',
        name: 'Amitabh Sen',
        phone: '9888811111',
        email: 'amitabh.sen@example.com',
        passwordHash: '$2a$10$demoHashCust1234567890',
        role: 'CUSTOMER',
        profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        language: 'en',
        createdAt: '2024-02-12T14:20:00Z'
      },
      {
        id: 'usr-cust-3',
        name: 'Pooja Agarwal',
        phone: '9888822222',
        email: 'pooja.a@example.com',
        passwordHash: '$2a$10$demoHashCust1234567890',
        role: 'CUSTOMER',
        language: 'hi',
        createdAt: '2024-02-25T16:00:00Z'
      },
      {
        id: 'usr-cust-4',
        name: 'Prof. Harishankar Joshi',
        phone: '9888833333',
        email: 'h.joshi@bhu.ac.in',
        passwordHash: '$2a$10$demoHashCust1234567890',
        role: 'CUSTOMER',
        language: 'hi',
        createdAt: '2024-03-01T09:15:00Z'
      },
      {
        id: 'usr-cust-5',
        name: 'Dr. Meenakshi Rai',
        phone: '9888844444',
        email: 'meenakshi.rai@hospital.org',
        passwordHash: '$2a$10$demoHashCust1234567890',
        role: 'CUSTOMER',
        language: 'en',
        createdAt: '2024-03-10T12:00:00Z'
      },
      {
        id: 'usr-cust-6',
        name: 'Rohit Khandelwal',
        phone: '9888855555',
        role: 'CUSTOMER',
        passwordHash: '$2a$10$demoHashCust1234567890',
        language: 'en',
        createdAt: '2024-03-18T10:45:00Z'
      },
      {
        id: 'usr-cust-7',
        name: 'Neelam Tiwari',
        phone: '9888866666',
        role: 'CUSTOMER',
        passwordHash: '$2a$10$demoHashCust1234567890',
        language: 'hi',
        createdAt: '2024-04-02T13:30:00Z'
      },
      {
        id: 'usr-cust-8',
        name: 'Alok Gupta',
        phone: '9888877777',
        role: 'CUSTOMER',
        passwordHash: '$2a$10$demoHashCust1234567890',
        language: 'en',
        createdAt: '2024-04-14T17:10:00Z'
      },
      {
        id: 'usr-cust-9',
        name: 'Shweta Pandey',
        phone: '9888888881',
        role: 'CUSTOMER',
        passwordHash: '$2a$10$demoHashCust1234567890',
        language: 'hi',
        createdAt: '2024-05-01T08:00:00Z'
      },
      {
        id: 'usr-cust-10',
        name: 'Deepak Chaurasia',
        phone: '9888899991',
        role: 'CUSTOMER',
        passwordHash: '$2a$10$demoHashCust1234567890',
        language: 'en',
        createdAt: '2024-05-15T15:25:00Z'
      }
    ];
    customers.forEach(c => this.users.set(c.id, c));

    // 5. 20+ Realistic Workers Across 10 Service Categories
    // Coordinates centered around Varanasi (Lat: ~25.28 - 25.35, Lng: ~82.95 - 83.02)
    const rawWorkers = [
      {
        userId: 'usr-work-1',
        workerId: 'SKR-EL-10291',
        name: 'Ramesh Kumar', // DEMO WORKER
        phone: '8888888888',
        societyId: 'soc-varanasi',
        photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200',
        lat: 25.3176,
        lng: 82.9739,
        rating: 4.85,
        jobs: 126,
        onTime: 94.0,
        skills: [
          { skillId: 'sk-elec', name: 'Electrician', experienceYears: 7, skillLevel: 'GOLD' as SkillLevel },
          { skillId: 'sk-ac', name: 'AC Technician', experienceYears: 4, skillLevel: 'GOLD' as SkillLevel }
        ],
        startingPrice: 299,
        bio: '7+ years experienced certified electrician and cooling technician. Specialized in home wiring, fuse box, inverter setup, and split AC repair.',
        verified: true,
        status: 'AVAILABLE' as AvailabilityStatus,
        token: 'SKR-EL-10291-VERIFIED'
      },
      {
        userId: 'usr-work-2',
        workerId: 'SKR-PL-10302',
        name: 'Priya Devi',
        phone: '8888888881',
        societyId: 'soc-varanasi',
        photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200',
        lat: 25.3210,
        lng: 82.9810,
        rating: 4.90,
        jobs: 94,
        onTime: 96.5,
        skills: [
          { skillId: 'sk-plumb', name: 'Plumber', experienceYears: 6, skillLevel: 'GOLD' as SkillLevel },
          { skillId: 'sk-clean', name: 'Cleaner', experienceYears: 3, skillLevel: 'SILVER' as SkillLevel }
        ],
        startingPrice: 249,
        bio: 'Master technician for sanitary fittings, bathroom fixtures, and emergency water motor restoration.',
        verified: true,
        status: 'AVAILABLE' as AvailabilityStatus,
        token: 'SKR-PL-10302-VERIFIED'
      },
      {
        userId: 'usr-work-3',
        workerId: 'SKR-CP-10411',
        name: 'Suresh Patel',
        phone: '8888888882',
        societyId: 'soc-kashi',
        photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200',
        lat: 25.3050,
        lng: 82.9650,
        rating: 4.75,
        jobs: 78,
        onTime: 91.0,
        skills: [
          { skillId: 'sk-carp', name: 'Carpenter', experienceYears: 9, skillLevel: 'GOLD' as SkillLevel }
        ],
        startingPrice: 349,
        bio: 'Precision wood artisan, custom furniture restoration, bed frame assembly, and security lock replacement.',
        verified: true,
        status: 'AVAILABLE' as AvailabilityStatus,
        token: 'SKR-CP-10411-VERIFIED'
      },
      {
        userId: 'usr-work-4',
        workerId: 'SKR-PT-10520',
        name: 'Anita Singh',
        phone: '8888888883',
        societyId: 'soc-purvanchal',
        photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200',
        lat: 25.3340,
        lng: 82.9920,
        rating: 4.80,
        jobs: 62,
        onTime: 93.0,
        skills: [
          { skillId: 'sk-paint', name: 'Painter', experienceYears: 5, skillLevel: 'GOLD' as SkillLevel }
        ],
        startingPrice: 499,
        bio: 'Waterproof painting, interior stencil art, texture wall finishes, and eco-friendly home paints.',
        verified: true,
        status: 'AVAILABLE' as AvailabilityStatus,
        token: 'SKR-PT-10520-VERIFIED'
      },
      {
        userId: 'usr-work-5',
        workerId: 'SKR-CL-10615',
        name: 'Mohammed Irfan',
        phone: '8888888884',
        societyId: 'soc-varanasi',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
        lat: 25.3120,
        lng: 82.9780,
        rating: 4.70,
        jobs: 110,
        onTime: 92.5,
        skills: [
          { skillId: 'sk-clean', name: 'Cleaner', experienceYears: 4, skillLevel: 'GOLD' as SkillLevel },
          { skillId: 'sk-dom', name: 'Domestic Helper', experienceYears: 2, skillLevel: 'SILVER' as SkillLevel }
        ],
        startingPrice: 399,
        bio: 'Specialist deep sanitization for post-renovation homes, commercial spaces, and fabric sofa extraction.',
        verified: true,
        status: 'AVAILABLE' as AvailabilityStatus,
        token: 'SKR-CL-10615-VERIFIED'
      },
      {
        userId: 'usr-work-6',
        workerId: 'SKR-GD-10708',
        name: 'Vikram Rao',
        phone: '8888888885',
        societyId: 'soc-kashi',
        photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200',
        lat: 25.2950,
        lng: 82.9900,
        rating: 4.92,
        jobs: 48,
        onTime: 97.0,
        skills: [
          { skillId: 'sk-gard', name: 'Gardener', experienceYears: 8, skillLevel: 'GOLD' as SkillLevel }
        ],
        startingPrice: 249,
        bio: 'Horticulture specialist, terrace vegetable farming setup, bonsai care, and lawn aerating.',
        verified: true,
        status: 'AVAILABLE' as AvailabilityStatus,
        token: 'SKR-GD-10708-VERIFIED'
      },
      {
        userId: 'usr-work-7',
        workerId: 'SKR-DR-10831',
        name: 'Manoj Yadav',
        phone: '8888888886',
        societyId: 'soc-purvanchal',
        photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200',
        lat: 25.3280,
        lng: 82.9600,
        rating: 4.88,
        jobs: 140,
        onTime: 98.0,
        skills: [
          { skillId: 'sk-driv', name: 'Driver', experienceYears: 11, skillLevel: 'MASTER' as SkillLevel }
        ],
        startingPrice: 450,
        bio: 'Commercial license holder with 11+ accident-free years. Smooth driving, GPS proficient, fluent in Hindi and English.',
        verified: true,
        status: 'AVAILABLE' as AvailabilityStatus,
        token: 'SKR-DR-10831-VERIFIED'
      },
      {
        userId: 'usr-work-8',
        workerId: 'SKR-CG-10940',
        name: 'Geeta Sharma',
        phone: '8888888887',
        societyId: 'soc-varanasi',
        photo: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200',
        lat: 25.3190,
        lng: 82.9850,
        rating: 4.95,
        jobs: 88,
        onTime: 99.0,
        skills: [
          { skillId: 'sk-care', name: 'Caregiver', experienceYears: 6, skillLevel: 'GOLD' as SkillLevel }
        ],
        startingPrice: 599,
        bio: 'Certified elderly caregiver with first aid training. Compassionate assistance with medication schedules and mobility.',
        verified: true,
        status: 'AVAILABLE' as AvailabilityStatus,
        token: 'SKR-CG-10940-VERIFIED'
      },
      {
        userId: 'usr-work-9',
        workerId: 'SKR-AC-11022',
        name: 'Santosh Maurya',
        phone: '8888888889',
        societyId: 'soc-kashi',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        lat: 25.3140,
        lng: 82.9690,
        rating: 4.81,
        jobs: 105,
        onTime: 93.0,
        skills: [
          { skillId: 'sk-ac', name: 'AC Technician', experienceYears: 7, skillLevel: 'GOLD' as SkillLevel },
          { skillId: 'sk-app', name: 'Appliance Repair', experienceYears: 5, skillLevel: 'GOLD' as SkillLevel }
        ],
        startingPrice: 499,
        bio: 'HVAC technician specialized in inverter AC PCB diagnostics, leak testing, and compressor overhauls.',
        verified: true,
        status: 'AVAILABLE' as AvailabilityStatus,
        token: 'SKR-AC-11022-VERIFIED'
      },
      {
        userId: 'usr-work-10',
        workerId: 'SKR-DH-11105',
        name: 'Sunita Bind',
        phone: '8888888890',
        societyId: 'soc-purvanchal',
        photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
        lat: 25.3260,
        lng: 82.9770,
        rating: 4.65,
        jobs: 54,
        onTime: 89.0,
        skills: [
          { skillId: 'sk-dom', name: 'Domestic Helper', experienceYears: 4, skillLevel: 'SILVER' as SkillLevel },
          { skillId: 'sk-clean', name: 'Cleaner', experienceYears: 2, skillLevel: 'BRONZE' as SkillLevel }
        ],
        startingPrice: 299,
        bio: 'Reliable and punctual domestic aid for household chores, dusting, kitchen assistance and organizing.',
        verified: true,
        status: 'AVAILABLE' as AvailabilityStatus,
        token: 'SKR-DH-11105-VERIFIED'
      },
      // 11 to 20
      {
        userId: 'usr-work-11',
        workerId: 'SKR-EL-11210',
        name: 'Ravi Shankar',
        phone: '8888888891',
        societyId: 'soc-varanasi',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        lat: 25.3110,
        lng: 82.9710,
        rating: 4.78,
        jobs: 72,
        onTime: 92.0,
        skills: [{ skillId: 'sk-elec', name: 'Electrician', experienceYears: 5, skillLevel: 'GOLD' as SkillLevel }],
        startingPrice: 299,
        bio: 'Certified cooperative electrician. Quick response for breaker trips, earthing pits, and chandeliers.',
        verified: true,
        status: 'AVAILABLE' as AvailabilityStatus,
        token: 'SKR-EL-11210-VERIFIED'
      },
      {
        userId: 'usr-work-12',
        workerId: 'SKR-PL-11319',
        name: 'Kailash Nath',
        phone: '8888888892',
        societyId: 'soc-kashi',
        photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
        lat: 25.3195,
        lng: 82.9805,
        rating: 4.87,
        jobs: 85,
        onTime: 95.0,
        skills: [{ skillId: 'sk-plumb', name: 'Plumber', experienceYears: 8, skillLevel: 'GOLD' as SkillLevel }],
        startingPrice: 249,
        bio: 'Heavy pipefitting, water tank cleaning, pressure pump installation, and concealed pipeline leak tracing.',
        verified: true,
        status: 'AVAILABLE' as AvailabilityStatus,
        token: 'SKR-PL-11319-VERIFIED'
      },
      {
        userId: 'usr-work-13',
        workerId: 'SKR-TC-11422',
        name: 'Arjun Verma',
        phone: '8888888893',
        societyId: 'soc-varanasi',
        photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200',
        lat: 25.3240,
        lng: 82.9720,
        rating: 4.82,
        jobs: 60,
        onTime: 94.0,
        skills: [{ skillId: 'sk-tech', name: 'General Technician', experienceYears: 4, skillLevel: 'GOLD' as SkillLevel }],
        startingPrice: 350,
        bio: 'Smart home networking, CCTV camera installation, Wi-Fi mesh routing, and home theater setup.',
        verified: true,
        status: 'AVAILABLE' as AvailabilityStatus,
        token: 'SKR-TC-11422-VERIFIED'
      },
      {
        userId: 'usr-work-14',
        workerId: 'SKR-CP-11504',
        name: 'Dinesh Vishwakarma',
        phone: '8888888894',
        societyId: 'soc-purvanchal',
        photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200',
        lat: 25.3310,
        lng: 82.9880,
        rating: 4.69,
        jobs: 42,
        onTime: 90.0,
        skills: [{ skillId: 'sk-carp', name: 'Carpenter', experienceYears: 6, skillLevel: 'SILVER' as SkillLevel }],
        startingPrice: 349,
        bio: 'Traditional and modular woodwork. Kitchen cabinetry adjustments, hinge repair, and customized shelving.',
        verified: true,
        status: 'AVAILABLE' as AvailabilityStatus,
        token: 'SKR-CP-11504-VERIFIED'
      },
      {
        userId: 'usr-work-15',
        workerId: 'SKR-AP-11612',
        name: 'Prakash Soni',
        phone: '8888888895',
        societyId: 'soc-kashi',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
        lat: 25.3080,
        lng: 82.9760,
        rating: 4.74,
        jobs: 53,
        onTime: 91.5,
        skills: [{ skillId: 'sk-app', name: 'Appliance Repair', experienceYears: 5, skillLevel: 'GOLD' as SkillLevel }],
        startingPrice: 399,
        bio: 'Washing machine motor fixing, microwave magnetron replacement, refrigerator thermostat diagnostics.',
        verified: true,
        status: 'AVAILABLE' as AvailabilityStatus,
        token: 'SKR-AP-11612-VERIFIED'
      },
      {
        userId: 'usr-work-16',
        workerId: 'SKR-CL-11728',
        name: 'Radha Rani',
        phone: '8888888896',
        societyId: 'soc-varanasi',
        photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
        lat: 25.3160,
        lng: 82.9820,
        rating: 4.89,
        jobs: 77,
        onTime: 96.0,
        skills: [{ skillId: 'sk-clean', name: 'Cleaner', experienceYears: 5, skillLevel: 'GOLD' as SkillLevel }],
        startingPrice: 399,
        bio: 'Specialist deep sanitization for modular kitchens, floor polishing, and post-party cleanup.',
        verified: true,
        status: 'AVAILABLE' as AvailabilityStatus,
        token: 'SKR-CL-11728-VERIFIED'
      },
      {
        userId: 'usr-work-17',
        workerId: 'SKR-PT-11833',
        name: 'Lalji Prajapati',
        phone: '8888888897',
        societyId: 'soc-purvanchal',
        photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200',
        lat: 25.3380,
        lng: 82.9640,
        rating: 4.62,
        jobs: 38,
        onTime: 88.0,
        skills: [{ skillId: 'sk-paint', name: 'Painter', experienceYears: 4, skillLevel: 'SILVER' as SkillLevel }],
        startingPrice: 499,
        bio: 'Exterior wall primers, enamel painting on metal gates and grills, ceiling plaster repair.',
        verified: true,
        status: 'AVAILABLE' as AvailabilityStatus,
        token: 'SKR-PT-11833-VERIFIED'
      },
      {
        userId: 'usr-work-18',
        workerId: 'SKR-CG-11945',
        name: 'Anupama Pandey',
        phone: '8888888898',
        societyId: 'soc-kashi',
        photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200',
        lat: 25.3020,
        lng: 82.9840,
        rating: 4.96,
        jobs: 67,
        onTime: 98.5,
        skills: [{ skillId: 'sk-care', name: 'Caregiver', experienceYears: 7, skillLevel: 'GOLD' as SkillLevel }],
        startingPrice: 599,
        bio: 'Specialized in post-stroke recovery support, blood sugar monitoring, and gentle mobility exercise.',
        verified: true,
        status: 'AVAILABLE' as AvailabilityStatus,
        token: 'SKR-CG-11945-VERIFIED'
      },
      {
        userId: 'usr-work-19',
        workerId: 'SKR-DR-12056',
        name: 'Suraj Bind',
        phone: '8888888899',
        societyId: 'soc-varanasi',
        photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200',
        lat: 25.3235,
        lng: 82.9665,
        rating: 4.71,
        jobs: 59,
        onTime: 92.0,
        skills: [{ skillId: 'sk-driv', name: 'Driver', experienceYears: 5, skillLevel: 'SILVER' as SkillLevel }],
        startingPrice: 450,
        bio: 'Courteous and reliable city driver. Excellent knowledge of Varanasi traffic routes and highway safety.',
        verified: true,
        status: 'AVAILABLE' as AvailabilityStatus,
        token: 'SKR-DR-12056-VERIFIED'
      },
      {
        userId: 'usr-work-20',
        workerId: 'SKR-EL-12167',
        name: 'Mukesh Tiwari',
        phone: '8888888800',
        societyId: 'soc-purvanchal',
        photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200',
        lat: 25.3290,
        lng: 82.9830,
        rating: 4.58,
        jobs: 22,
        onTime: 86.0,
        skills: [{ skillId: 'sk-elec', name: 'Electrician', experienceYears: 3, skillLevel: 'SILVER' as SkillLevel }],
        startingPrice: 299,
        bio: 'New cooperative member. Fast switchboard repair, LED lighting setup, and emergency short circuit troubleshooting.',
        verified: false, // PENDING for admin test
        status: 'AVAILABLE' as AvailabilityStatus,
        token: 'SKR-EL-12167-PENDING'
      },
      {
        userId: 'usr-work-21',
        workerId: 'SKR-PL-12278',
        name: 'Om Prakash Chaurasia',
        phone: '8888888801',
        societyId: 'soc-varanasi',
        photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200',
        lat: 25.3150,
        lng: 82.9790,
        rating: 4.83,
        jobs: 91,
        onTime: 95.0,
        skills: [{ skillId: 'sk-plumb', name: 'Plumber', experienceYears: 8, skillLevel: 'GOLD' as SkillLevel }],
        startingPrice: 249,
        bio: 'Experienced in high-rise building plumbing, overhead tank float valves, and CPVC leak repairs.',
        verified: false, // PENDING for admin test
        status: 'AVAILABLE' as AvailabilityStatus,
        token: 'SKR-PL-12278-PENDING'
      }
    ];

    rawWorkers.forEach(w => {
      // 1. Create worker user
      const user: User = {
        id: w.userId,
        name: w.name,
        phone: w.phone,
        passwordHash: '$2a$10$demoHashWorker123456789',
        role: 'WORKER',
        profilePhoto: w.photo,
        language: 'hi',
        createdAt: '2023-05-10T10:00:00Z'
      };
      this.users.set(user.id, user);

      // 2. Compute skill score
      const { score, level } = calculateSkillScore(w.jobs, w.rating, w.onTime);

      const soc = this.societies.get(w.societyId);
      const worker: Worker = {
        id: `wrk-${w.userId.replace('usr-work-', '')}`,
        userId: w.userId,
        societyId: w.societyId,
        societyName: soc ? soc.name : 'Varanasi Labour Cooperative Society',
        workerId: w.workerId,
        name: w.name,
        phone: w.phone,
        profilePhoto: w.photo,
        governmentIdType: 'Aadhaar (Cooperative Verified)',
        governmentIdVerified: w.verified,
        verificationStatus: w.verified ? 'VERIFIED' : 'PENDING',
        availabilityStatus: w.status,
        latitude: w.lat,
        longitude: w.lng,
        averageRating: w.rating,
        completedJobs: w.jobs,
        onTimePercentage: w.onTime,
        skillScore: score,
        skillLevel: level,
        totalEarnings: w.jobs * 350,
        welfareStatus: 'ACTIVE',
        insuranceStatus: 'ACTIVE',
        skills: w.skills,
        startingPrice: w.startingPrice,
        bio: w.bio,
        createdAt: '2023-05-10T10:00:00Z',
        qrVerificationToken: w.token
      };
      this.workers.set(worker.id, worker);

      // 3. Create Welfare record
      const welfare: Welfare = {
        id: `welf-${worker.id}`,
        workerId: worker.id,
        insuranceStatus: 'ACTIVE',
        insuranceProvider: 'National Cooperative Shramik Suraksha Yojana',
        policyNumber: `POL-SHR-${worker.workerId}-2026`,
        welfareFund: Math.round(w.jobs * 25 + 1100),
        accidentCoverage: 'ACTIVE',
        lastContribution: 250,
        nextRenewal: '2027-03-12',
        lastUpdated: new Date().toISOString(),
        contributions: [
          { date: '2026-03-01', amount: 250, type: 'Monthly Member Contribution' },
          { date: '2026-02-01', amount: 250, type: 'Monthly Member Contribution' },
          { date: '2026-01-01', amount: 250, type: 'Monthly Member Contribution' }
        ]
      };
      this.welfareRecords.set(worker.id, welfare);

      // 4. Milestone Certificates
      if (w.jobs >= 50) {
        const cert: Certificate = {
          id: `cert-${worker.id}-1`,
          workerId: worker.id,
          workerName: worker.name,
          certificateType: 'Platform-issued Skill Recognition Certificate',
          skill: w.skills[0].name.toUpperCase(),
          level: level,
          certificateNumber: `SS-${w.skills[0].name.substring(0, 4).toUpperCase()}-2026-${w.workerId.replace('SKR-', '')}`,
          issueDate: '2026-01-15',
          verificationToken: `CERT-TOK-${worker.workerId}`,
          issuer: 'Sahakar Seva Cooperative Platform & Federation'
        };
        this.certificates.set(cert.id, cert);
      }
    });

    // 6. 50+ Realistic Bookings
    const workerList = Array.from(this.workers.values());
    const customerList = customers;

    const statuses: ('COMPLETED' | 'REQUESTED' | 'ACCEPTED' | 'WORKER_ON_WAY' | 'IN_PROGRESS' | 'CANCELLED')[] = [
      'COMPLETED', 'COMPLETED', 'COMPLETED', 'COMPLETED', 'COMPLETED', 'IN_PROGRESS', 'ACCEPTED', 'REQUESTED'
    ];

    const addresses = [
      'Flat 402, Ganga Heights, Dashashwamedh Ghat Road, Varanasi',
      'House 12/B, Kabir Nagar Colony, Durgakund, Varanasi',
      'Plot 88, Bhelupur Crossing, Near Water Tank, Varanasi',
      '304 Shanti Kunj Apartments, Sigra, Varanasi',
      'House 5, Lanka BHU Main Gate Road, Varanasi',
      'B-14 Ravindrapuri Extension, Varanasi',
      'Flat 101, Surya Enclave, Mahmoorganj, Varanasi',
      'House 22, Orderly Bazaar, Cantonment, Varanasi'
    ];

    let bookingCount = 1;
    // Specific active booking for demo worker (Ramesh Kumar - wrk-1) and demo customer (Sunita Sharma - usr-cust-1)
    const demoBooking1: Booking = {
      id: 'BK-1001',
      customerId: 'usr-cust-1',
      customerName: 'Sunita Sharma',
      customerPhone: '9999999999',
      workerId: 'wrk-1',
      workerName: 'Ramesh Kumar',
      workerPhone: '8888888888',
      serviceId: 'sk-elec',
      serviceName: 'Electrician',
      bookingType: 'INSTANT',
      status: 'ACCEPTED',
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: '10:30 AM',
      address: 'Flat 402, Ganga Heights, Dashashwamedh Ghat Road, Varanasi',
      latitude: 25.3180,
      longitude: 82.9745,
      estimatedPrice: 350,
      finalPrice: 350,
      emergency: false,
      problemDescription: 'Main hall MCB tripping constantly whenever AC and Geyser run simultaneously.',
      createdAt: new Date(Date.now() - 3600000).toISOString()
    };
    this.bookings.set(demoBooking1.id, demoBooking1);

    const demoBooking2: Booking = {
      id: 'BK-1002',
      customerId: 'usr-cust-1',
      customerName: 'Sunita Sharma',
      customerPhone: '9999999999',
      workerId: 'wrk-2',
      workerName: 'Priya Devi',
      workerPhone: '8888888881',
      serviceId: 'sk-plumb',
      serviceName: 'Plumber',
      bookingType: 'SCHEDULED',
      status: 'COMPLETED',
      scheduledDate: '2026-03-20',
      scheduledTime: '02:00 PM',
      address: 'Flat 402, Ganga Heights, Dashashwamedh Ghat Road, Varanasi',
      latitude: 25.3180,
      longitude: 82.9745,
      estimatedPrice: 320,
      finalPrice: 320,
      emergency: false,
      problemDescription: 'Kitchen sink pipe blockage and minor faucet leakage.',
      createdAt: '2026-03-20T08:00:00Z'
    };
    this.bookings.set(demoBooking2.id, demoBooking2);

    // Payment for BK-1002
    this.payments.set('pay-1002', {
      id: 'pay-1002',
      bookingId: 'BK-1002',
      amount: 320,
      platformFee: 20,
      welfareContribution: 25,
      gst: 18,
      workerEarning: 257,
      paymentMethod: 'UPI',
      transactionId: 'TXN-UPI-20260320-948172',
      status: 'COMPLETED',
      paidAt: '2026-03-20T15:30:00Z'
    });

    // Rating for BK-1002
    this.ratings.set('rat-1002', {
      id: 'rat-1002',
      bookingId: 'BK-1002',
      customerId: 'usr-cust-1',
      customerName: 'Sunita Sharma',
      workerId: 'wrk-2',
      rating: 5,
      review: 'Priya arrived right on time and fixed the stubborn kitchen drain smoothly. Excellent cooperative service!',
      onTime: true,
      createdAt: '2026-03-20T16:00:00Z'
    });

    // Generate remaining 48 bookings
    for (let i = 3; i <= 52; i++) {
      const w = workerList[i % workerList.length];
      const c = customerList[i % customerList.length];
      const sk = w.skills[0];
      const st = statuses[i % statuses.length];
      const isEmergency = i % 7 === 0;
      const addr = addresses[i % addresses.length];
      const dayOffset = (i * 2) % 28;
      const date = new Date(Date.now() - dayOffset * 86400000).toISOString().split('T')[0];

      const bId = `BK-${1000 + i}`;
      const estPrice = Math.round(w.startingPrice + (i % 3) * 50);

      const b: Booking = {
        id: bId,
        customerId: c.id,
        customerName: c.name,
        customerPhone: c.phone,
        workerId: w.id,
        workerName: w.name,
        workerPhone: w.phone,
        serviceId: sk.skillId,
        serviceName: sk.name,
        bookingType: isEmergency ? 'EMERGENCY' : i % 3 === 0 ? 'INSTANT' : 'SCHEDULED',
        status: st,
        scheduledDate: date,
        scheduledTime: `${9 + (i % 8)}:00 ${i % 2 === 0 ? 'AM' : 'PM'}`,
        address: addr,
        latitude: w.latitude + (Math.random() - 0.5) * 0.01,
        longitude: w.longitude + (Math.random() - 0.5) * 0.01,
        estimatedPrice: estPrice,
        finalPrice: st === 'COMPLETED' ? estPrice : undefined,
        emergency: isEmergency,
        problemDescription: `${sk.name} service needed at residence. Urgent attention appreciated.`,
        createdAt: new Date(Date.now() - (dayOffset + 1) * 86400000).toISOString()
      };
      this.bookings.set(bId, b);

      if (st === 'COMPLETED') {
        const payId = `pay-${bId}`;
        this.payments.set(payId, {
          id: payId,
          bookingId: bId,
          amount: estPrice,
          platformFee: 20,
          welfareContribution: 25,
          gst: Math.round(estPrice * 0.05),
          workerEarning: Math.round(estPrice * 0.85),
          paymentMethod: i % 2 === 0 ? 'UPI' : 'CARD',
          transactionId: `TXN-${i % 2 === 0 ? 'UPI' : 'CARD'}-2026-${bId}`,
          status: 'COMPLETED',
          paidAt: new Date(Date.now() - dayOffset * 86400000).toISOString()
        });

        // 70% of completed bookings have reviews
        if (i % 10 !== 0) {
          const ratId = `rat-${bId}`;
          const isSuspicious = i === 15; // 1 suspicious test review
          this.ratings.set(ratId, {
            id: ratId,
            bookingId: bId,
            customerId: c.id,
            customerName: c.name,
            workerId: w.id,
            rating: isSuspicious ? 1 : 4 + (i % 2),
            review: isSuspicious
              ? 'Bad service worst avoid completely bad service worst avoid'
              : `Very punctual and professional work done by ${w.name}. Satisfied with the cooperative rate.`,
            onTime: !isSuspicious,
            createdAt: new Date(Date.now() - dayOffset * 86400000).toISOString(),
            flaggedSuspicious: isSuspicious,
            flagReason: isSuspicious ? 'Repeated spam phrasing & abnormal velocity' : undefined
          });
        }
      }
    }

    // 7. Seed 30 Days of Historical Demand Data for AI Forecasting
    const baseServices = ['Electrician', 'Plumber', 'Carpenter', 'Painter', 'Cleaner', 'Gardener', 'AC Technician'];
    const zones = ['Central Varanasi', 'North Zone (Orderly Bazaar)', 'South Zone (BHU / Lanka)', 'East Zone (Ghats & Chowk)'];

    for (let day = 30; day >= 1; day--) {
      const dt = new Date(Date.now() - day * 86400000).toISOString().split('T')[0];
      baseServices.forEach(srv => {
        zones.forEach(zn => {
          let baseReq = 12;
          if (srv === 'Plumber' || srv === 'Electrician') baseReq = 26;
          if (srv === 'AC Technician') baseReq = 22;
          if (zn === 'Central Varanasi') baseReq += 8;

          // Introduce realistic variance and weekend surge
          const variance = Math.floor(Math.sin(day) * 5) + Math.floor(Math.random() * 6);
          this.demandHistory.push({
            date: dt,
            service: srv,
            requests: Math.max(3, baseReq + variance),
            zone: zn
          });
        });
      });
    }

    // 8. Notifications
    this.notifications.set('notif-1', {
      id: 'notif-1',
      userId: 'usr-work-1',
      title: 'New Booking Assigned!',
      message: 'Sunita Sharma requested Instant Electrician service at Dashashwamedh Road.',
      type: 'BOOKING',
      read: false,
      createdAt: new Date().toISOString()
    });

    this.notifications.set('notif-2', {
      id: 'notif-2',
      userId: 'usr-work-1',
      title: 'Welfare Fund Credited',
      message: '₹25 cooperative welfare contribution credited from your completed job.',
      type: 'WELFARE',
      read: true,
      createdAt: new Date(Date.now() - 86400000).toISOString()
    });

    this.notifications.set('notif-3', {
      id: 'notif-3',
      userId: 'usr-cust-1',
      title: 'Booking Accepted',
      message: 'Ramesh Kumar has accepted your Electrician request (BK-1001).',
      type: 'BOOKING',
      read: false,
      createdAt: new Date().toISOString()
    });
  }
}

export const db = new DatabaseStore();
