import React, { useState } from 'react';
import { c } from 'ttag';
import {
    Alert,
    BackButtonModal,
    Button,
    Field,
    FooterModal,
    HeaderModal,
    InnerModal,
    Label,
    PrimaryButton,
    Row,
    TitleModal,
} from 'react-components';
import ExpirationTimeDropdown from './ExpirationTimeDropdown';
import DateTime from './DateTime';
import { getExpirationTime } from '../Drive/helpers';
import { EXPIRATION_DAYS } from '../../constants';

interface Props {
    hasExpirationTime: boolean;
    saving?: boolean;
    onSave: (duration: EXPIRATION_DAYS) => void;
    onBack: () => void;
    onClose?: () => void;
    modalTitleID: string;
}

function EditExpirationTimeState({ hasExpirationTime, saving, onBack, onSave, onClose, modalTitleID }: Props) {
    const [duration, setDuration] = useState(EXPIRATION_DAYS.NEVER);
    const [expirationTime, setExpirationTime] = useState<number | null>(null);

    const handleChangeExpirationDate = (duration: EXPIRATION_DAYS) => {
        setDuration(duration);

        const expirationTime = getExpirationTime(duration);
        setExpirationTime(expirationTime);
    };

    return (
        <>
            <HeaderModal
                className="flex flex-items-center"
                onClose={onClose}
                hasClose={!saving}
                modalTitleID={modalTitleID}
            >
                <div className="flex flex-items-center">
                    <BackButtonModal onClick={onBack} />
                    <TitleModal id={modalTitleID}>{c('Title').t`Expiration date`}</TitleModal>
                </div>
            </HeaderModal>
            <form
                className="pm-modalContent"
                onReset={onBack}
                onSubmit={(e) => {
                    e.preventDefault();
                    if (!hasExpirationTime && !duration) {
                        onBack();
                    } else {
                        onSave(duration);
                    }
                }}
            >
                <InnerModal>
                    <Alert>{c('Info').t`Change this link's expiration date.`}</Alert>
                    <Row>
                        <Label htmlFor="shared-url-expiration-date">{c('Label').t`Link expires`}</Label>
                        <Field>
                            <div className="flex flex-nowrap flex-items-center onmobile-flex-column">
                                <ExpirationTimeDropdown value={duration} onChange={handleChangeExpirationDate} />
                                <span className="pre onmobile-mt0-25 w30">
                                    {expirationTime && (
                                        <>
                                            <span className="ml2 mr0-5 onmobile-ml0">{c('Info').t`on`}</span>
                                            <DateTime key="expirationTime" value={expirationTime} />
                                        </>
                                    )}
                                </span>
                            </div>
                        </Field>
                    </Row>
                </InnerModal>
                <FooterModal>
                    <Button type="reset">{c('Action').t`Cancel`}</Button>
                    <PrimaryButton type="submit" loading={saving}>{c('Action').t`Update`}</PrimaryButton>
                </FooterModal>
            </form>
        </>
    );
}

export default EditExpirationTimeState;
