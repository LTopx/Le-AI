import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialog as AlertDialogComponent,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface AlertDialogProps {
  trigger?: React.ReactNode
  title?: string
  description?: string
  okText?: string
  cancelText?: string
  actionClassName?: string
  onOk?: () => void
}

export function AlertDialog({
  trigger,
  title,
  description,
  okText,
  cancelText,
  actionClassName,
  onOk,
}: AlertDialogProps) {
  return (
    <AlertDialogComponent>
      <AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText || 'Cancel'}</AlertDialogCancel>
          <AlertDialogAction className={actionClassName} onClick={onOk}>
            {okText || 'OK'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogComponent>
  )
}
