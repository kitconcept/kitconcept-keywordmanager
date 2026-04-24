import {
  Button,
  Modal,
  RadioGroup,
  Radio,
  TextField,
  Select,
} from '@plone/components';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import clearSVG from '@plone/volto/icons/clear.svg';
import { Dialog } from '@plone/components';

interface RenameModalProps {
  selectionCount: number;
  selectedKeys: string | Set<string>;
  keywords: { items?: { name: string }[] };
  onConfirm: (newKeyword: string, oldKeywords: string[]) => void;
}

const RenameModal = ({
  selectionCount,
  selectedKeys,
  keywords,
  onConfirm,
}: RenameModalProps) => {
  const [selectedRadio, setSelectedRadio] = useState<string>('select');
  const [name, setName] = useState<string | null>(null);

  return (
    <Modal className="rename-modal">
      <Dialog>
        {({ close }) => (
          <>
            <div className="modal-header">
              <h2>
                <FormattedMessage
                  id="rename-modal-title"
                  defaultMessage="Rename & merge keyword(s)"
                />
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
                <FormattedMessage
                  id="rename-modal-description"
                  defaultMessage="You are about to rename {num} selected keyword(s). This action cannot be undone. Either select one of the existing keywords to keep or enter a new name to replace all selected keywords."
                  values={{ num: <strong>{selectionCount}</strong> }}
                />
              </p>
              <RadioGroup
                defaultValue="select"
                value={selectedRadio}
                onChange={setSelectedRadio}
              >
                <div className="react-aria-Radio-wrapper">
                  <Radio value="select" />
                  <Select
                    isDisabled={selectedRadio !== 'select'}
                    label="Select existing keyword to keep:"
                    selectionMode="single"
                    placeholder="Please select ..."
                    onChange={setName}
                    items={
                      selectedKeys === 'all'
                        ? keywords.items?.map((kw) => ({
                            label: kw.name,
                            value: kw.name,
                          }))
                        : [...(selectedKeys as Set<string>)].map((kw) => ({
                            label: kw,
                            value: kw,
                          }))
                    }
                  />
                </div>
                <div className="react-aria-Radio-wrapper">
                  <Radio value="text" />
                  <TextField
                    isDisabled={selectedRadio !== 'text'}
                    label="New keyword name:"
                    placeholder="Please enter new name"
                    onChange={setName}
                  />
                </div>
              </RadioGroup>
            </div>
            <div className="modal-actions">
              <Button
                onPress={() => {
                  setName(null);
                  close();
                }}
              >
                <FormattedMessage id="Cancel" defaultMessage="Cancel" />
              </Button>
              <Button
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
                <FormattedMessage
                  id="Rename & Merge"
                  defaultMessage="Rename & Merge"
                />
              </Button>
            </div>
          </>
        )}
      </Dialog>
    </Modal>
  );
};

export default RenameModal;
