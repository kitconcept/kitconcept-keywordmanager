import { Button, Modal, Spinner } from '@plone/components';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import { FormattedMessage } from 'react-intl';
import clearSVG from '@plone/volto/icons/clear.svg';
import { Dialog } from '@plone/components';
import { useIntl, defineMessages } from 'react-intl';

interface DeleteModalProps {
  isLoading: boolean;
  selectionCount?: number;
  selectedKeys: string | Set<string>;
  keywords: { items?: { name: string; total: number }[] };
  onConfirm: (keys: string[]) => void;
}

const messages = defineMessages({
  loading: {
    id: 'loading',
    defaultMessage: 'Loading',
  },
});

const DeleteModal = ({
  isLoading,
  selectionCount,
  selectedKeys,
  keywords,
  onConfirm,
}: DeleteModalProps) => {
  const intl = useIntl();

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
                {typeof selectedKeys === 'string' ? (
                  <FormattedMessage
                    id="single-confirm-modal-description"
                    defaultMessage="You are about to delete the keyword {keyword} from {num} content object(s). This action cannot be undone. Are you sure you want to proceed?"
                    values={{
                      keyword: <strong>{selectedKeys}</strong>,
                      num: (
                        <strong>
                          {
                            keywords.items?.find(
                              (item) => item.name === selectedKeys,
                            )?.total
                          }
                        </strong>
                      ),
                    }}
                  />
                ) : (
                  <FormattedMessage
                    id="confirm-modal-description"
                    defaultMessage="You are about to delete {num} selected keyword(s). This action cannot be undone. Are you sure you want to proceed?"
                    values={{ num: <strong>{selectionCount}</strong> }}
                  />
                )}
              </p>
            </div>
            <div className="modal-actions">
              <Button className="cancel-action" onPress={close}>
                <FormattedMessage id="Cancel" defaultMessage="Cancel" />
              </Button>
              <Button
                className="confirm-action"
                onPress={() => {
                  onConfirm(
                    selectedKeys === 'all'
                      ? keywords.items?.map((kw) => kw.name) ?? []
                      : typeof selectedKeys === 'string'
                        ? [selectedKeys]
                        : Array.from(selectedKeys),
                  );
                  close();
                }}
              >
                {isLoading ? (
                  <Spinner aria-label={intl.formatMessage(messages.loading)} />
                ) : (
                  <FormattedMessage id="Delete" defaultMessage="Delete" />
                )}
              </Button>
            </div>
          </>
        )}
      </Dialog>
    </Modal>
  );
};

export default DeleteModal;
