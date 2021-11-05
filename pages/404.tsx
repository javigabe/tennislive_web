import React, { ReactElement, useEffect } from 'react';

export default function Custom404(): ReactElement {
  useEffect(() => {
    window.location.replace('/');
  });

  return (
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ marginTop: '30px' }}>404 - Page Not Found</h1>
    </div>
  );
}
