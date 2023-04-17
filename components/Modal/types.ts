export interface IModalPropTypes extends React.PropsWithChildren {
  maskClosable?: boolean;
  onClose: () => void;
  open: boolean;
  title?: React.ReactNode;
  width?: number;
}
