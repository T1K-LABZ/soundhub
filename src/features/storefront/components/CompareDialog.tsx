import { Close } from "@mui/icons-material";
import { Alert, Dialog, IconButton } from "@mui/material";
import type { ReactNode } from "react";
import { useStorefront } from "../hooks/useStorefront";
import { money, categoryOf } from "../storefront.utils";
import type { StorefrontProduct } from "../storefront.types";

export function CompareDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { comparison, toggleCompare } = useStorefront();
  const specificationLabels = Array.from(
    new Set(
      comparison.flatMap(
        (product) => product.specifications?.map((spec) => spec.label) ?? [],
      ),
    ),
  );
  const rows: Array<[string, (product: StorefrontProduct) => ReactNode]> = [
    ["Price", (product) => money(product.sellingPrice)],
    ["Brand", (product) => product.brand ?? "Recoil"],
    ["Category", (product) => categoryOf(product) || "-"],
    [
      "Stock status",
      (product) =>
        Number(product.itemsInStock) > 0 ? "In stock" : "Out of stock",
    ],
    ...specificationLabels.map(
      (label): [string, (product: StorefrontProduct) => ReactNode] => [
        label,
        (product) =>
          product.specifications?.find((spec) => spec.label === label)?.value ??
          "-",
      ],
    ),
  ];
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <div className="compare-dialog">
        <div className="drawer-head">
          <div>
            <p className="eyebrow">Compare gear</p>
            <h2>Find the right fit</h2>
          </div>
          <IconButton onClick={onClose} aria-label="Close comparison">
            <Close />
          </IconButton>
        </div>
        {comparison.length < 2 && (
          <Alert severity="info">
            Add one more product to compare specifications side by side.
          </Alert>
        )}
        <div className="comparison-table">
          <div className="compare-row compare-products">
            <span>Product</span>
            {comparison.map((product) => (
              <div key={product.id}>
                <b>{product.name}</b>
                <IconButton
                  aria-label={`Remove ${product.name} from comparison`}
                  onClick={() => toggleCompare(product)}
                >
                  <Close />
                </IconButton>
              </div>
            ))}
          </div>
          {rows.map(([label, render]) => (
            <div className="compare-row" key={label}>
              <span>{label}</span>
              {comparison.map((product) => (
                <div key={product.id}>{render(product)}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Dialog>
  );
}
