import React, { useRef } from 'react';
import CreateFolder from '../buttons/createFolder/CreateFolder';
import { useOnClickOutside } from '../useOnClickOutside/useOnClickOutside';
import './style.less';

const ContextMenu = ({ x, y, closeContextMenu, target }) => {
  const contextMenuRef = useRef(null);
  useOnClickOutside(contextMenuRef, closeContextMenu);
  return (
    <div
      ref={contextMenuRef}
      onClick={closeContextMenu}
      className="context-menu"
      style={{ top: `${y}px`, left: `${x}px` }}
    >
      {target === 'Хуй' && <CreateFolder />}
    </div>
  );
};

export default ContextMenu;
