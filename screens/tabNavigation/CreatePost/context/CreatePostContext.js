import React, {createContext, useContext, useState} from 'react';

// largeSelectedBy: 'store' | 'product'
const CreatePostContext = createContext(null);

export const CreatePostProvider = ({children}) => {
  // appliedLargeBy tracks which sheet has applied Large; null means none applied yet
  const [appliedLargeBy, setAppliedLargeBy] = useState(null);

  // applySize only sets the applied lock when user confirms with Apply
  const applySize = (which, size) => {
    if (size === 'large') {
      setAppliedLargeBy(which);
    } else {
      // choosing small implies the other becomes large
      setAppliedLargeBy(which === 'store' ? 'product' : 'store');
    }
  };

  // get the effective size considering applied locks; before any apply, use defaults
  const getAppliedSizeFor = (which) => {
    if (appliedLargeBy) return appliedLargeBy === which ? 'large' : 'small';
    // defaults before any apply: store large, product small
    return which === 'store' ? 'large' : 'small';
  };

  const isLargeDisabled = (which) => {
    // large is disabled for `which` if the other side already has an applied large
    const other = which === 'store' ? 'product' : 'store';
    return appliedLargeBy === other;
  };

  return (
    <CreatePostContext.Provider value={{appliedLargeBy, applySize, getAppliedSizeFor, isLargeDisabled}}>
      {children}
    </CreatePostContext.Provider>
  );
};

export const useCreatePostContext = () => {
  const ctx = useContext(CreatePostContext);
  if (!ctx) throw new Error('useCreatePostContext must be used within CreatePostProvider');
  return ctx;
};

export default CreatePostContext;
