export interface IModalPropTypes extends React.PropsWithChildren {
  keyboard?: boolean;
  maskClosable?: boolean;
  onClose: () => void;
  open: boolean;
  title?: React.ReactNode;
  width?: number;
}
