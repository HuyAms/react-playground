import {useState} from 'react';
import {foldersData} from './data';
import {ChevronRight, Folder as FolderIcon} from 'lucide-react';
import clsx from 'clsx';

export default function FolderPage() {
  console.log(foldersData);

  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  function toggleFolder(folderId: string) {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      newSet.has(folderId) ? newSet.delete(folderId) : newSet.add(folderId);
      return newSet;
    });
  }

  // This approach renders folders in a flat list, and then uses CSS to style the folders that are children of other folders.
  // However, it does not work for nested folders > 1 level deep.
  // i.e when I close the first level folder, the second level  is closed but the third level is not.
  // better to use recursion to render the folders. - see V2
  function renderFolders() {
    return foldersData.map(folder => {
      const hasChildren = foldersData.some(f => f.parentId === folder._id);
      const isExpanded = expandedFolders.has(folder._id);

      const isChildFolder = folder.parentId !== null;

      const parentExpanded = isChildFolder ? expandedFolders.has(folder.parentId) : false;

      if (isChildFolder && !parentExpanded) {
        return null;
      }

      const marginLeft = folder.depth * 16;

      return (
        <div
          className={clsx(`flex items-center gap-2`)}
          style={{marginLeft: `${marginLeft}px`}}
          key={folder._id}
        >
          {hasChildren ? (
            <button onClick={() => toggleFolder(folder._id)}>
              <ChevronRight
                className={clsx('w-4 h-4', {
                  'rotate-90': isExpanded,
                })}
              />
            </button>
          ) : (
            <div className="w-4 h-4" />
          )}
          <FolderIcon className="w-4 h-4" />
          <span>{folder.name}</span>
        </div>
      );
    });
  }

  return <div>{renderFolders()}</div>;
}
