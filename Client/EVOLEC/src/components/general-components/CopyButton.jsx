import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'primereact/button';
import React from 'react';

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  xl2: 'text-2xl',
  xl3: 'text-3xl',
};

const CopyButton = ({ text, size = 'md' }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied!");
    } catch (err) {
      console.error("Copy Error:", err);
    }
  };

  return (
    <Button
      onClick={handleCopy}
      className={`${sizeClasses[size]} cursor-pointer`}
      unstyled={true}
    >
      <FontAwesomeIcon icon={faCopy} size='lg' />
      <i className={`pi pi-copy ${sizeClasses[size]} cursor-pointer`} />
    </Button>
  );
};

export default CopyButton;