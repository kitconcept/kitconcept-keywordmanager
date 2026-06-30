import { Button, Modal, RadioGroup, Radio, TextField } from '@plone/components';
import { Select } from './Select';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import clearSVG from '@plone/volto/icons/clear.svg';
import { Dialog } from '@plone/components';
import { Spinner } from '@plone/components';
import { useIntl, defineMessages } from 'react-intl';

import type { Selection } from 'react-aria-components';

interface RenameModalProps {
  isLoading: boolean;
  selectionCount: number;
  selectedKeys: Selection;
  keywords: { items?: { name: string }[] };
  onConfirm: (newKeyword: string, oldKeywords: string[]) => void;
}

const messages = defineMessages({
  loading: {
    id: 'loading',
    defaultMessage: 'Loading',
  },
  selectLabel: {
    id: 'Select existing keyword to keep:',
    defaultMessage: 'Select existing keyword to keep:',
  },
  selectPlaceholder: {
    id: 'Please select ...',
    defaultMessage: 'Please select ...',
  },
  textFieldLabel: {
    id: 'New keyword name:',
    defaultMessage: 'New keyword name:',
  },
  textFieldPlaceholder: {
    id: 'Please enter new name',
    defaultMessage: 'Please enter new name',
  },
});

const RenameModal = ({
  isLoading,
  selectionCount,
  selectedKeys,
  keywords,
  onConfirm,
}: RenameModalProps) => {
  const intl = useIntl();
  const [selectedRadio, setSelectedRadio] = useState<string>('select');
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    if (selectionCount === 1) {
      setSelectedRadio('text');
    } else {
      setSelectedRadio('select');
    }
  }, [selectionCount]);

  return (
    <Modal className="rename-modal">
      <Dialog>
        {({ close }) => (
          <>
            <div className="modal-header">
              <h2>
                {selectionCount > 1 ? (
                  <FormattedMessage
                    id="rename-modal-title"
                    defaultMessage="Rename & merge keyword(s)"
                  />
                ) : (
                  <FormattedMessage
                    id="single-rename-modal-title"
                    defaultMessage="Rename keyword"
                  />
                )}
              </h2>
              <Button
                onPress={() => {
                  setName(null);
                  close();
                }}
              >
                <Icon name={clearSVG} size="20px" />
              </Button>
            </div>
            <div className="modal-body">
              <p>
                {selectionCount > 1 ? (
                  <FormattedMessage
                    id="rename-modal-description"
                    defaultMessage="You are about to rename & merge {num} selected keyword(s). This action cannot be undone. Either select one of the existing keywords to keep or enter a new name to replace all selected keywords."
                    values={{ num: <strong>{selectionCount}</strong> }}
                  />
                ) : (
                  <FormattedMessage
                    id="single-rename-modal-description"
                    defaultMessage="You are about to rename the keyword {keyword}. This action cannot be undone. Please enter a new name to proceed."
                    values={{ keyword: <strong>{selectedKeys}</strong> }}
                  />
                )}
              </p>
              <RadioGroup
                defaultValue="select"
                value={selectedRadio}
                onChange={setSelectedRadio}
              >
                {selectionCount > 1 && (
                  <div className="react-aria-Radio-wrapper">
                    <Radio value="select" />
                    <Select
                      isDisabled={selectedRadio !== 'select'}
                      label={intl.formatMessage(messages.selectLabel)}
                      selectionMode="single"
                      placeholder={intl.formatMessage(
                        messages.selectPlaceholder,
                      )}
                      onChange={setName}
                      items={
                        selectedKeys === 'all'
                          ? keywords.items?.map((kw) => ({
                              label: kw.name,
                              value: kw.name,
                            }))
                          : [...selectedKeys].map((kw) => ({
                              label: kw,
                              value: kw,
                            }))
                      }
                    />
                  </div>
                )}
                <div className="react-aria-Radio-wrapper">
                  <Radio value="text" />
                  <TextField
                    isDisabled={selectedRadio !== 'text'}
                    label={intl.formatMessage(messages.textFieldLabel)}
                    placeholder={intl.formatMessage(
                      messages.textFieldPlaceholder,
                    )}
                    onChange={setName}
                  />
                </div>
              </RadioGroup>
            </div>
            <div className="modal-actions">
              <Button
                className="cancel-action"
                onPress={() => {
                  setName(null);
                  close();
                }}
              >
                <FormattedMessage id="Cancel" defaultMessage="Cancel" />
              </Button>
              <Button
                className="confirm-action"
                isDisabled={name === null}
                onPress={() => {
                  onConfirm(
                    name!,
                    selectedKeys === 'all'
                      ? keywords.items?.map((kw) => kw.name) ?? []
                      : [...(selectedKeys as Set<string>)],
                  );
                  setName(null);
                  close();
                }}
              >
                {isLoading ? (
                  <Spinner aria-label={intl.formatMessage(messages.loading)} />
                ) : selectionCount > 1 ? (
                  <FormattedMessage
                    id="Rename & Merge"
                    defaultMessage="Rename & Merge"
                  />
                ) : (
                  <FormattedMessage id="Rename" defaultMessage="Rename" />
                )}
              </Button>
            </div>
          </>
        )}
      </Dialog>
    </Modal>
  );
};

export default RenameModal;
