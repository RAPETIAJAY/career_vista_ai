import mongoose from 'mongoose';
import Scholarship from '../models/Scholarship';
import { logger } from '../utils/logger';

// Auto-detect sector based on provider and type
function detectSector(provider: string, type: string): 'Government' | 'Corporate' | 'Private' {
  const providerLower = provider.toLowerCase();
  
  // Government indicators
  if (
    type === 'Central' ||
    type === 'State' ||
    providerLower.includes('government') ||
    providerLower.includes('ministry') ||
    providerLower.includes('department') ||
    providerLower.includes('ugc') ||
    providerLower.includes('aicte') ||
    providerLower.includes('csir') ||
    providerLower.includes('icmr') ||
    providerLower.includes('dst') ||
    providerLower.includes('national') ||
    providerLower.includes('central') ||
    providerLower.includes('state') ||
    providerLower.includes('public')
  ) {
    return 'Government';
  }

  // Corporate indicators
  if (
    providerLower.includes('foundation') ||
    providerLower.includes('limited') ||
    providerLower.includes('ltd') ||
    providerLower.includes('corporation') ||
    providerLower.includes('company') ||
    providerLower.includes('reliance') ||
    providerLower.includes('tata') ||
    providerLower.includes('infosys') ||
    providerLower.includes('wipro') ||
    providerLower.includes('corporate') ||
    providerLower.includes('industries') ||
    providerLower.includes('group') ||
    providerLower.includes('enterprises')
  ) {
    return 'Corporate';
  }

  // Default to Private (NGOs, trusts, universities, etc.)
  return 'Private';
}

async function updateScholarshipSectors() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/careervista';
    await mongoose.connect(mongoUri);
    
    logger.info('Connected to MongoDB');
    
    // Get all scholarships
    const scholarships = await Scholarship.find({});
    
    logger.info(`Found ${scholarships.length} scholarships`);
    
    let updated = 0;
    let government = 0;
    let corporate = 0;
    let privateCount = 0;
    
    for (const scholarship of scholarships) {
      const detectedSector = detectSector(scholarship.provider, scholarship.type);
      
      // Update if sector is missing or different
      if (!scholarship.sector || scholarship.sector !== detectedSector) {
        await Scholarship.findByIdAndUpdate(scholarship._id, { sector: detectedSector });
        updated++;
        logger.info(`Updated ${scholarship.name} - Provider: ${scholarship.provider}, Type: ${scholarship.type} -> Sector: ${detectedSector}`);
      }
      
      // Count by sector
      if (detectedSector === 'Government') government++;
      else if (detectedSector === 'Corporate') corporate++;
      else privateCount++;
    }
    
    logger.info('Update Summary:');
    logger.info(`- Total scholarships: ${scholarships.length}`);
    logger.info(`- Updated: ${updated}`);
    logger.info(`- Government: ${government}`);
    logger.info(`- Corporate: ${corporate}`);
    logger.info(`- Private: ${privateCount}`);
    
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
    
  } catch (error) {
    logger.error('Error updating scholarship sectors:', error);
    process.exit(1);
  }
}

// Run the script
updateScholarshipSectors();