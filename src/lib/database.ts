import { ref, get, query, orderByChild, remove } from 'firebase/database';
import { database } from './firebase';

export const cardRequestsRef = ref(database, 'cardRequests');

export const fetchCardRequests = async () => {
  try {
    const snapshot = await get(query(cardRequestsRef, orderByChild('timestamp')));
    return snapshot;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const markCardAsDone = async (cardId: string) => {
  try {
    const cardRef = ref(database, `cardRequests/${cardId}`);
    await remove(cardRef);
    return true;
  } catch (error) {
    console.error('Error marking card as done:', error);
    throw error;
  }
};