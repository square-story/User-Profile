import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type ConfirmOptions = {
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  icon?: React.ReactNode
  confirmButtonClassName?: string
  cancelButtonClassName?: string
}

export function useConfirm() {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<ConfirmOptions>({})
  const [resolvePromise, setResolvePromise] = useState<(v: boolean) => void>(() => () => { })

  const confirm = (opts: ConfirmOptions = {}) =>
    new Promise<boolean>((resolve) => {
      setOptions(opts)
      setOpen(true)
      setResolvePromise(() => resolve)
    })

  const handleCancel = () => {
    setOpen(false)
    resolvePromise(false)
  }
  const handleConfirm = () => {
    setOpen(false)
    resolvePromise(true)
  }

  const ConfirmDialog = (
    <AlertDialog open={open} onOpenChange={(val) => {
      setOpen(val)
      if (!val) {
        resolvePromise(false)
      }
    }}>
      <AlertDialogContent>
        <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
          <div className="flex size-9 shrink-0 items-center justify-center" aria-hidden="true">
            {options.icon}
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>{options.title || "Are you sure?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {options.description || "This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className={options.cancelButtonClassName || ""} onClick={handleCancel}>{options.cancelText || "Cancel"}</AlertDialogCancel>
          <AlertDialogAction className={options.confirmButtonClassName || "bg-red-500 hover:bg-red-600 text-white"} onClick={handleConfirm}>{options.confirmText || "Confirm"}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )

  return { confirm, ConfirmDialog }
}