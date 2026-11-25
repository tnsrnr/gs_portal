import type { StudyCard } from '../project-cards';
import { projectCards } from '../project-cards';
import { strategyCards } from './strategy';
import { softwareCards } from './software';
import { digitalServiceCards } from './digital-service';
import { digitalNetworkCards } from './digital-network';
import { digitalSecurityCards } from './digital-security';
import { dataAnalysisCards } from './data-analysis';
import { aiCards } from './ai';
import { caSystemCards } from './ca-system';
import { algorithmCards } from './algorithm';
import { osCards } from './os';
import { dataStructureCards } from './data-structure';

export const study3Cards: Record<string, StudyCard[]> = {
  strategy: strategyCards,
  project: projectCards,
  software: softwareCards,
  'digital-service': digitalServiceCards,
  'digital-network': digitalNetworkCards,
  'digital-security': digitalSecurityCards,
  'data-analysis': dataAnalysisCards,
  ai: aiCards,
  'ca-system': caSystemCards,
  algorithm: algorithmCards,
  os: osCards,
  'data-structure': dataStructureCards,
};
