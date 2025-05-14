import {useState} from 'react';
import {foldersData} from './data';
import {ChevronRight, Folder as FolderIcon} from 'lucide-react';
import clsx from 'clsx';

type FolderProps = {
  id: string;
  name: string;
  isExpanded: boolean;
  hasChildren: boolean;
  onToggle: (folderId: string) => void;
  depth: number;
};

function Folder({name, isExpanded, hasChildren, onToggle, id, depth}: FolderProps) {
  return (
    <div
      className={clsx(`flex items-center gap-2`)}
      style={{paddingLeft: `${depth * 8}px`}}
      key={name}
    >
      {hasChildren ? (
        <button onClick={() => onToggle(id)}>
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
      <span>{name}</span>
    </div>
  );
}

export default function FolderPage() {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  function toggleFolder(folderId: string) {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      newSet.has(folderId) ? newSet.delete(folderId) : newSet.add(folderId);
      return newSet;
    });
  }

  function renderFolders(parentId: string | null) {
    const childFolders = foldersData.filter(folder => folder.parentId === parentId);

    if (!childFolders.length) {
      return null;
    }

    return childFolders.map(folder => {
      const hasChildren = foldersData.some(f => f.parentId === folder._id);
      const isExpanded = expandedFolders.has(folder._id);

      return (
        <div key={folder._id}>
          <Folder
            id={folder._id}
            depth={folder.depth}
            name={folder.name}
            isExpanded={isExpanded}
            hasChildren={hasChildren}
            onToggle={toggleFolder}
          />
          {/* Only render children if the folder is expanded */}
          {isExpanded && renderFolders(folder._id)}
        </div>
      );
    });
  }

  return <>{renderFolders(null)}</>;
}
