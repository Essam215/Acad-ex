// Icon Registry - Maps icon names to React Icons components
import {
  MdCalculate, MdEdit, MdFunctions, MdLibraryBooks,
  MdGridView, MdLeaderboard, MdPerson, MdDashboard,
  MdFireplace, MdEmojiEvents, MdDiamond, MdWeekend,
  MdLanguage, MdMenuBook, MdMosque, MdPublic, MdSettings, MdAutoAwesome
} from 'react-icons/md';
import {
  GiChemicalDrop, GiMicroscope, GiDna1, GiAchievement
} from 'react-icons/gi';
import {
  BiSearch, BiWallet
} from 'react-icons/bi';
import {
  BsLightning, BsBook, BsLightningCharge
} from 'react-icons/bs';
import { FaCrown } from 'react-icons/fa';

export const iconMap = {
  // Subject icons
  'MdCalculate': MdCalculate,
  'GiChemicalDrop': GiChemicalDrop,
  'MdEdit': MdEdit,
  'MdFunctions': MdFunctions,
  'BiLightningCharge': BsLightningCharge,
  'GiMicroscope': GiMicroscope,
  'GiDna': GiDna1,
  'MdLibraryBooks': MdLibraryBooks,
  'MdLanguage': MdLanguage,
  'MdMenuBook': MdMenuBook,
  'MdMosque': MdMosque,
  'MdPublic': MdPublic,
  'MdSettings': MdSettings,
  
  // Navigation icons
  'MdGridView': MdGridView,
  'MdLeaderboard': MdLeaderboard,
  'MdPerson': MdPerson,
  'MdDashboard': MdDashboard,
  'MdViewWeekend': MdWeekend,
  'MdAutoAwesome': MdAutoAwesome,
  
  // Badge icons
  'BsLightning': BsLightning,
  'MdFireplace': MdFireplace,
  'MdDiamond': MdDiamond,
  'MdCrown': FaCrown,
  'MdEmojiEvents': MdEmojiEvents,
  
  // Other icons
  'MdAchievement': GiAchievement,
  'BiSearch': BiSearch,
  'BiWallet': BiWallet,
  'BsBook': BsBook,
};

export const getIcon = (iconName) => {
  return iconMap[iconName] || MdCalculate; // Default to calculator if icon not found
};
