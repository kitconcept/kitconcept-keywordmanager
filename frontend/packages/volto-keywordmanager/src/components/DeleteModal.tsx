import { Button, Modal } from '@plone/components';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import { FormattedMessage } from 'react-intl';
import clearSVG from '@plone/volto/icons/clear.svg';
import { Dialog } from '@plone/components';

interface DeleteModalProps {
  selectionCount: number;
  selectedKeys: string | Set<string>;
  keywords: { items?: { name: string }[] };
  onConfirm: (keys: string[]) => void;
}

const DeleteModal = ({
  selectionCount,
  selectedKeys,
  keywords,
  onConfirm,
}: DeleteModalProps) => {
  return (
    <Modal className="delete-modal">
      <Dialog>
        {({ close }) => (
          <>
            <div className="modal-header">
              <h2>
                <FormattedMessage
                  id="confirm-modal-title"
                  defaultMessage="Delete keyword(s)"
                />
              </h2>
              <Button onPress={close}>
                <Icon name={clearSVG} size="20px" />
              </Button>
            </div>
            <div className="modal-body">
              <p>
                <FormattedMessage
                  id="confirm-modal-description"
                  defaultMessage="You are about to delete {num} selected keyword(s). This action cannot be undone. Are you sure you want to proceed?"
                  values={{ num: <strong>{selectionCount}</strong> }}
                />
              </p>
            </div>
            <div className="modal-actions">
              <Button onPress={close}>
                <FormattedMessage id="Cancel" defaultMessage="Cancel" />
              </Button>
              <Button
                onPress={() => {
                  onConfirm(
                    selectedKeys === 'all'
                      ? keywords.items?.map((kw) => kw.name) ?? []
                      : [...(selectedKeys as Set<string>)],
                  );
                  close();
                }}
              >
                <FormattedMessage id="Delete" defaultMessage="Delete" />
              </Button>
            </div>
          </>
        )}
      </Dialog>
    </Modal>
  );
};

export default DeleteModal;
