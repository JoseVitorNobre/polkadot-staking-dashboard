// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React, { useCallback } from 'react';
import { QrScan } from './Scan.js';
import type { DataInstance, ScanSignatureProps } from './types.js';

const ScanSignature = ({
  className,
  onError,
  onScan,
  size,
  style,
}: ScanSignatureProps): React.ReactElement<ScanSignatureProps> => {
  const onScanCallback = useCallback(
    (signature: DataInstance) =>
      signature && onScan({ signature: `0x${signature}` }),
    [onScan]
  );

  return (
    <QrScan
      className={className}
      onError={onError}
      onScan={onScanCallback}
      size={size}
      style={style}
    />
  );
};

export const QrScanSignature = React.memo(ScanSignature);
