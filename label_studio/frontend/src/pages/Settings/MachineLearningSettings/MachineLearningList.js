import { format } from 'date-fns';
import { useCallback, useContext } from 'react';
import { FaEllipsisV } from 'react-icons/fa';
import truncate from 'truncate-middle';
import { Button, Card, Dropdown, Menu } from '../../../components';
import { DescriptionList } from '../../../components/DescriptionList/DescriptionList';
import { confirm } from '../../../components/Modal/Modal';
import { Oneof } from '../../../components/Oneof/Oneof';
import { ApiContext } from '../../../providers/ApiProvider';
import { cn } from '../../../utils/bem';

export const MachineLearningList = ({ backends, fetchBackends, onEdit }) => {
  const rootClass = cn('ml');
  const api = useContext(ApiContext);

  const onDeleteModel = useCallback(async (backend) => {
    await api.callApi('deleteMLBackend', {
      params: {
        pk: backend.id,
      },
    });
    await fetchBackends();
  }, [fetchBackends, api]);

  const onStartTraining = useCallback(async (backend) => {
    await api.callApi('trainMLBackend', {
      params: {
        pk: backend.id,
      },
    });
    await fetchBackends();
  }, [fetchBackends, api]);

  const onStartCentralTraining = useCallback(async (backend) => {
    await api.callApi('trainCentral', {
      params: {
        pk: backend.id,
      },
    });
    await fetchBackends();
  }, [fetchBackends, api]);

  const onStartExperiment = useCallback(async (backend) => {
    await api.callApi('experimentCentral', {
      params: {
        pk: backend.id,
      },
    });
    await fetchBackends();
  }, [fetchBackends, api]);

  return (
    <div className={rootClass}>
      {backends.map(backend => (
        <BackendCard
          key={backend.id}
          backend={backend}
          onStartTrain={onStartTraining}
          onStartCentralTrain={onStartCentralTraining}
          onStartExperiment={onStartExperiment}
          onDelete={onDeleteModel}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

const BackendCard = ({backend, onStartTrain, onStartCentralTrain, onStartExperiment, onEdit, onDelete}) => {
  const confirmDelete = useCallback((backend) => {
    confirm({
      title: "Delete ML Backend",
      body: "This action cannot be undone. Are you sure?",
      buttonLook: "destructive",
      onOk(){ onDelete?.(backend); },
    });
  }, [backend, onDelete]);

  return (
    <Card style={{marginTop: 0}} header={backend.title} extra={(
      <div className={cn('ml').elem('info')}>
        <BackendState backend={backend}/>

        <Dropdown.Trigger align="right" content={(
          <Menu size="small">
            <Menu.Item onClick={() => onEdit(backend)}>Edit</Menu.Item>
            <Menu.Item onClick={() => confirmDelete(backend)}>Delete</Menu.Item>
          </Menu>
        )}>
          <Button type="link" icon={<FaEllipsisV/>}/>
        </Dropdown.Trigger>
      </div>
    )}>
      <DescriptionList className={cn('ml').elem('summary')}>
        <DescriptionList.Item term="URL" termStyle={{whiteSpace: 'nowrap'}}>
          {truncate(backend.url, 20, 10, '...')}
        </DescriptionList.Item>
        {backend.description && (
          <DescriptionList.Item
            term="Description"
            children={backend.description}
          />
        )}
        <DescriptionList.Item term="Version">
          {backend.version ? format(new Date(backend.version), 'MMMM dd, yyyy ∙ HH:mm:ss') : 'unknown'}
        </DescriptionList.Item>
      </DescriptionList>

      <div>
        <Button disabled={backend.state !== "CO"} onClick={() => onStartTrain(backend)}>
          Start Training
        </Button>
      </div>

      <div>
        <Button disabled={backend.state !== "CO"} onClick={() => onStartCentralTrain(backend)}>
          Start Central Training
        </Button>
      </div>

      <div>
        <Button disabled={backend.state !== "CO"} onClick={() => onStartExperiment(backend)}>
          Start Experimenting
        </Button>
      </div>
    </Card>
  );
};

const BackendState = ({backend}) => {
  const { state } = backend;
  return (
    <div className={cn('ml').elem('status')}>
      <span className={cn('ml').elem('indicator').mod({state})}></span>
      <Oneof value={state} className={cn('ml').elem('status-label')}>
        <span case="DI">Disconnected</span>
        <span case="CO">Connected</span>
        <span case="ER">Error</span>
        <span case="TR">Training</span>
        <span case="PR">Predicting</span>
      </Oneof>
    </div>
  );
};
