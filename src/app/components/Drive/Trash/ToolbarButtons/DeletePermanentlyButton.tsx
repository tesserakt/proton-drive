import React from 'react';
import { c } from 'ttag';

import { ToolbarButton } from 'react-components';

import { useTrashContent } from '../TrashContentProvider';
import useTrash from '../../../../hooks/drive/useTrash';
import useListNotifications from '../../../../hooks/util/useListNotifications';
import useConfirm from '../../../../hooks/util/useConfirm';

interface Props {
    shareId: string;
    disabled?: boolean;
}

const DeletePermanentlyButton = ({ shareId, disabled }: Props) => {
    const { deleteLinks } = useTrash();
    const { fileBrowserControls } = useTrashContent();
    const { createDeleteLinksNotifications } = useListNotifications();
    const { openConfirmModal } = useConfirm();

    const { selectedItems } = fileBrowserControls;

    const handleDeleteClick = async () => {
        if (!selectedItems.length) {
            return;
        }

        const toDelete = selectedItems;

        const title = c('Title').t`Delete permanently`;
        const confirm = c('Action').t`Delete permanently`;
        const message = c('Info').t`permanently delete selected item(s) from Trash`;

        openConfirmModal(title, confirm, message, async () => {
            const deleted = await deleteLinks(
                shareId,
                toDelete.map(({ LinkID }) => LinkID)
            );
            createDeleteLinksNotifications(toDelete, deleted);
        });
    };

    return (
        <ToolbarButton
            disabled={disabled}
            title={c('Action').t`Delete permanently`}
            icon="trash"
            onClick={handleDeleteClick}
            data-testid="toolbar-delete"
        />
    );
};

export default DeletePermanentlyButton;
