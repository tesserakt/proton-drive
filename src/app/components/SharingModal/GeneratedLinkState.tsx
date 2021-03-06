import React, { useRef } from 'react';
import { c } from 'ttag';
import { fromUnixTime, format as formatDate } from 'date-fns';
import { dateLocale } from 'proton-shared/lib/i18n';
import { textToClipboard } from 'proton-shared/lib/helpers/browser';
import {
    Alert,
    Button,
    FooterModal,
    HeaderModal,
    Icon,
    InnerModal,
    Input,
    Label,
    PrimaryButton,
    Row,
    Toggle,
    useNotifications,
} from 'react-components';

interface Props {
    itemName: string;
    password: string;
    expirationTime: number | null;
    token: string;
    includePassword: boolean;
    customPassword: boolean;
    modalTitleID: string;
    deleting?: boolean;
    onClose?: () => void;
    onEditPasswordClick: () => void;
    onEditExpirationTimeClick: () => void;
    onDeleteLinkClick: () => void;
    onIncludePasswordToggle: () => void;
}

function GeneratedLinkState({
    modalTitleID,
    onClose,
    itemName,
    password,
    expirationTime,
    token,
    customPassword,
    deleting,
    includePassword,
    onEditPasswordClick,
    onEditExpirationTimeClick,
    onDeleteLinkClick,
    onIncludePasswordToggle,
}: Props) {
    const contentRef = useRef<HTMLDivElement>(null);
    const { createNotification } = useNotifications();
    const baseUrl = `${window.location.origin}/urls`;

    const handleClickCopyURL = () => {
        if (contentRef.current) {
            textToClipboard(
                includePassword ? `${baseUrl}/${token}#${password}` : `${baseUrl}/${token}`,
                contentRef.current
            );
            createNotification({ text: c('Success').t`The link to your file was successfully copied.` });
        }
    };

    const handleCopyPasswordClick = () => {
        if (contentRef.current) {
            textToClipboard(password, contentRef.current);
            createNotification({ text: c('Success').t`Password was copied to the clipboard` });
        }
    };

    const boldNameText = (
        <b key="name" className="break">
            {`"${itemName}"`}
        </b>
    );

    const url = `${baseUrl}/${token}${includePassword ? `#${password}` : ''}`;
    const expirationDate = expirationTime
        ? formatDate(fromUnixTime(expirationTime), 'PPp', { locale: dateLocale })
        : c('Label').t`Never`;

    return (
        <>
            <HeaderModal modalTitleID={modalTitleID} onClose={onClose}>
                {c('Title').t`Share with link`}
            </HeaderModal>
            <div ref={contentRef} className="pm-modalContent">
                <InnerModal>
                    <Alert>
                        {c('Info').jt`Anyone with this link can download the file ${boldNameText}.`}
                        <br />
                        {c('Info').t`Protect the link with a password.`}
                    </Alert>
                    <Row>
                        <div className="flex flex-item-fluid">
                            <Input
                                readOnly
                                value={url}
                                className="mb0-5 pl1 pr1 pt0-5 pb0-5 ellipsis pre"
                                data-testid="sharing-modal-url"
                            />
                        </div>
                        <div className="flex flex-justify-end ml0-5 onmobile-ml0">
                            <div>
                                <PrimaryButton id="copy-url-button" onClick={handleClickCopyURL} className="min-w5e">{c(
                                    'Action'
                                ).t`Copy`}</PrimaryButton>
                            </div>
                        </div>
                    </Row>
                    <Row>
                        <Label htmlFor="sharing-modal-password">
                            <span className="mr0-5">{c('Label').t`Password protection`}</span>
                        </Label>
                        <div className="flex flex-justify-start mr0-5 onmobile-mr0">
                            <Toggle
                                className="mb0-5"
                                disabled={customPassword}
                                id="passwordModeToggle"
                                checked={!includePassword}
                                onChange={onIncludePasswordToggle}
                                data-testid="sharing-modal-passwordModeToggle"
                            />
                        </div>
                        <div className="flex flex-item-fluid onmobile-mb0-5">
                            {!includePassword && (
                                <Input
                                    id="sharing-modal-password"
                                    data-testid="sharing-modal-password"
                                    readOnly
                                    value={password}
                                    className="pl1 pr1 pt0-5 pb0-5 ellipsis pre"
                                    icon={
                                        <button
                                            title={c('Label').t`Copy password`}
                                            className="inline-flex flex-item-noshrink"
                                            tabIndex={-1}
                                            type="button"
                                            onClick={handleCopyPasswordClick}
                                        >
                                            <Icon className="mauto" name="copy" alt={c('Label').t`Copy password`} />
                                        </button>
                                    }
                                />
                            )}
                        </div>
                        <div className="flex flex-justify-end ml0-5 onmobile-ml0">
                            <div>
                                <Button
                                    id="edit-password-button"
                                    hidden={includePassword}
                                    onClick={onEditPasswordClick}
                                    className="min-w5e"
                                >{c('Action').t`Edit`}</Button>
                            </div>
                        </div>
                    </Row>

                    <Row>
                        <Label htmlFor="sharing-modal-expiration-time">
                            <span className="mr0-5">{c('Label').t`Expiration date`}</span>
                        </Label>
                        <div className="flex flex-column flex-item-fluid">
                            <Input
                                id="sharing-modal-expiration-time"
                                data-testid="sharing-modal-expiration-time"
                                readOnly
                                value={expirationDate}
                                className="w100 onmobile-mb0-5 pl1 pr1 pt0-5 pb0-5 ellipsis"
                            />
                        </div>
                        <div className="flex flex-justify-end ml0-5 onmobile-ml0">
                            <div>
                                <Button
                                    id="edit-expiration-time-button"
                                    onClick={onEditExpirationTimeClick}
                                    className="min-w5e"
                                >{c('Action').t`Edit`}</Button>
                            </div>
                        </div>
                    </Row>
                </InnerModal>
                <FooterModal>
                    <div className="flex flex-spacebetween w100 flex-nowrap">
                        <Button loading={deleting} onClick={onDeleteLinkClick}>{c('Action').t`Stop sharing`}</Button>
                        <Button onClick={onClose}>{c('Action').t`Done`}</Button>
                    </div>
                </FooterModal>
            </div>
        </>
    );
}

export default GeneratedLinkState;
