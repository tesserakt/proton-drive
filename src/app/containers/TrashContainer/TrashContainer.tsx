import React, { useEffect, useMemo, useCallback } from 'react';
import { PrivateAppContainer, useToggle } from 'react-components';
import { Route, Redirect, Switch, RouteComponentProps } from 'react-router-dom';
import AppHeader from '../../components/layout/AppHeader';
import AppSidebar from '../../components/layout/AppSidebar';
import TrashContainerView from './TrashContainerView';
import EmptyTrashButton from '../../components/Drive/Trash/EmptyTrashButton';
import { useDriveCache } from '../../components/DriveCache/DriveCacheProvider';
import { useDriveActiveFolder } from '../../components/Drive/DriveFolderProvider';

const TrashContainer = ({ match }: RouteComponentProps<{ shareId?: string }>) => {
    const cache = useDriveCache();
    const { setFolder } = useDriveActiveFolder();
    const { state: expanded, toggle: toggleExpanded } = useToggle();

    useEffect(() => {
        setFolder(undefined);
    }, []);

    const shareId = useMemo(() => {
        const shareId = match.params.shareId || cache.get.defaultShareMeta()?.ShareID;
        if (!shareId) {
            throw new Error('Drive is not initilized, cache has been cleared unexpectedly');
        }
        return shareId;
    }, [match.params.shareId]);

    const header = (
        <AppHeader
            floatingPrimary={<EmptyTrashButton floating shareId={shareId} />}
            isHeaderExpanded={expanded}
            toggleHeaderExpanded={toggleExpanded}
        />
    );

    const sidebar = (
        <AppSidebar
            primary={<EmptyTrashButton shareId={shareId} />}
            isHeaderExpanded={expanded}
            toggleHeaderExpanded={toggleExpanded}
        />
    );

    const renderContainerView = useCallback(() => <TrashContainerView shareId={shareId} />, [shareId]);

    return (
        <PrivateAppContainer header={header} sidebar={sidebar}>
            <Switch>
                <Route path="/drive/trash/:shareId?" exact component={renderContainerView} />
                <Redirect to="/drive/trash" />
            </Switch>
        </PrivateAppContainer>
    );
};

export default TrashContainer;