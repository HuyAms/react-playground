const key = 'pollingIds-3';

type LocalStorageData = {
  id: string;
  isDone: boolean;
};

export function getPollingIds(): LocalStorageData[] {
  const ids = localStorage.getItem(key);
  const allPollingIds: LocalStorageData[] = ids ? JSON.parse(ids) : [];

  return allPollingIds.filter(item => !item.isDone);
}

function getAllPollingData(): LocalStorageData[] {
  const ids = localStorage.getItem(key);
  return ids ? JSON.parse(ids) : [];
}

export function addPollingId(id: string) {
  const pollingData: LocalStorageData[] = getAllPollingData();
  pollingData.push({id, isDone: false});

  localStorage.setItem(key, JSON.stringify(pollingData));
}

export function updatePollingId(id: string, isDone: boolean) {
  const pollingData: LocalStorageData[] = getAllPollingData();
  const index = pollingData.findIndex(item => item.id === id);
  if (index !== -1) {
    pollingData[index].isDone = isDone;
  }
  localStorage.setItem(key, JSON.stringify(pollingData));
}
