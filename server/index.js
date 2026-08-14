import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const propertySchema = new mongoose.Schema(
  {
    title: String,
    location: String,
    price: Number,
    type: String,
    area: Number,
    status: String,
    intent: String,
    score: Number,
    commission: Number,
    walkTime: String,
    tags: [String],
    image: String,
  },
  { timestamps: true }
);

const leadSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    need: String,
    budget: String,
    stage: String,
    priority: String,
    source: String,
    propertyId: String,
  },
  { timestamps: true }
);

const Property = mongoose.models.Property || mongoose.model('Property', propertySchema);
const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);

const demoProperties = [
  {
    title: 'Family-ready 1 BHK near Ostwal Nagari',
    location: 'Ostwal Nagari, Nalasopara East',
    price: 3650000,
    type: '1 BHK',
    area: 545,
    status: 'Fresh',
    intent: 'Sale',
    score: 96,
    commission: 73000,
    walkTime: '4 min from 90 Feet Road',
    tags: ['Loan Possible', 'School Nearby', 'Owner Reference'],
    image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Smart rental home for working couple',
    location: 'Nalasopara East Station Belt',
    price: 12500,
    type: '1 RK',
    area: 360,
    status: 'Visit Today',
    intent: 'Rent',
    score: 89,
    commission: 12500,
    walkTime: '12 min from station',
    tags: ['Fast Possession', 'Low Deposit', 'Owner Reference'],
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
  },
];

let memoryProperties = [...demoProperties];
let memoryLeads = [];
let databaseReady = false;

async function connectDatabase() {
  if (!process.env.MONGODB_URI) return;
  await mongoose.connect(process.env.MONGODB_URI);
  databaseReady = true;
  const count = await Property.countDocuments();
  if (count === 0) await Property.insertMany(demoProperties);
}

app.get('/api/health', (_request, response) => {
  response.json({ ok: true, database: databaseReady ? 'mongodb' : 'memory' });
});

app.get('/api/properties', async (_request, response) => {
  const properties = databaseReady ? await Property.find().sort({ createdAt: -1 }) : memoryProperties;
  response.json(properties);
});

app.post('/api/properties', async (request, response) => {
  const payload = request.body;
  if (databaseReady) {
    const property = await Property.create(payload);
    response.status(201).json(property);
    return;
  }
  const property = { ...payload, _id: `memory-${Date.now()}` };
  memoryProperties = [property, ...memoryProperties];
  response.status(201).json(property);
});

app.get('/api/leads', async (_request, response) => {
  const leads = databaseReady ? await Lead.find().sort({ createdAt: -1 }) : memoryLeads;
  response.json(leads);
});

app.post('/api/leads', async (request, response) => {
  const payload = request.body;
  if (databaseReady) {
    const lead = await Lead.create(payload);
    response.status(201).json(lead);
    return;
  }
  const lead = { ...payload, _id: `lead-${Date.now()}` };
  memoryLeads = [lead, ...memoryLeads];
  response.status(201).json(lead);
});

connectDatabase()
  .catch((error) => {
    console.warn('MongoDB connection failed. Falling back to in-memory data.', error.message);
  })
  .finally(() => {
    app.listen(port, () => {
      console.log(`Swagat Enterprise API running on http://localhost:${port}/api`);
    });
  });
