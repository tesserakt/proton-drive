import React from 'react';
import { Icon, classnames, Tooltip } from 'react-components';
import { c } from 'ttag';
import { TransferState, Upload, Download } from '../../interfaces/transfer';
import {
    isTransferPaused,
    isTransferProgress,
    isTransferDone,
    isTransferError,
    isTransferCanceled,
} from '../../utils/transfer';
import { TransferType } from './interfaces';

interface Props {
    transfer: Upload | Download;
    type: string;
    speed: string;
}

const getErrorText = (error: any) => {
    if (error?.data?.Error) {
        return error.data.Error;
    }
    return error?.message || c('Info').t`Something went wrong, please try again later.`;
};

const TransferStateIndicator = ({ transfer, type, speed }: Props) => {
    const shouldShowDirection =
        isTransferProgress(transfer) ||
        isTransferPaused(transfer) ||
        isTransferCanceled(transfer) ||
        isTransferDone(transfer);

    const statusInfo = {
        [TransferState.Initializing]: {
            text: c('Info').t`Initializing`,
        },
        [TransferState.Pending]: {
            text: c('Info').t`Queued`,
            icon: 'clock',
        },
        [TransferState.Progress]: {
            text: c('Info').t`${speed}/s`,
            icon: type === TransferType.Download ? 'download' : 'upload',
        },
        [TransferState.Paused]: {
            text: c('Info').t`Paused`,
            icon: 'pause',
        },
        [TransferState.Done]: {
            text: type === TransferType.Download ? c('Info').t`Downloaded` : c('Info').t`Uploaded`,
            icon: 'on',
        },
        [TransferState.Error]: {
            text: c('Info').t`Failed`,
            icon: 'attention',
        },
        [TransferState.Canceled]: {
            text: c('Info').t`Canceled`,
            icon: 'off',
        },
        [TransferState.Finalizing]: {
            text: c('Info').t`Finalizing`,
            icon: 'on',
        },
    }[transfer.state];

    const progressTitle = type === TransferType.Download ? c('Info').t`Downloading` : c('Info').t`Uploading`;
    const transferTitle = isTransferProgress(transfer) ? progressTitle : statusInfo.text;
    const errorText = transfer.error && getErrorText(transfer.error);

    return (
        <div
            className={classnames([
                'ellipsis flex-noMinChildren flex-items-center flex-nowrap',
                isTransferPaused(transfer) && 'color-global-info',
                isTransferDone(transfer) && 'color-global-success',
                isTransferError(transfer) && 'color-global-warning',
            ])}
            id={transfer.id}
            title={transferTitle}
        >
            {/* Mobile icon */}
            {statusInfo.icon && !isTransferProgress(transfer) && (
                <Tooltip title={errorText} originalPlacement="top" className="flex-item-noshrink nodesktop notablet">
                    <Icon name={errorText ? 'info' : statusInfo.icon} alt={statusInfo.text} />
                </Tooltip>
            )}

            {/* Desktop text */}
            <span className="nomobile flex flex-items-center">
                {errorText && (
                    <Tooltip title={errorText} originalPlacement="top" className="flex mr0-5">
                        <Icon name="info" />
                    </Tooltip>
                )}
                {statusInfo.text}
            </span>

            {shouldShowDirection && (
                <Icon
                    name={type === TransferType.Download ? 'download' : 'upload'}
                    className={classnames([
                        'flex-item-noshrink ml0-5',
                        isTransferDone(transfer) && 'notablet nodesktop',
                    ])}
                    alt={progressTitle}
                />
            )}

            {/* Hidden Info for screen readers */}
            <span className="sr-only" aria-atomic="true" aria-live="assertive">
                {transfer.meta.filename} {transferTitle}
            </span>
        </div>
    );
};

export default TransferStateIndicator;
