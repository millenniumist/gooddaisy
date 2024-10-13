import { OrderItem, Product } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type OrderItemWithProduct = OrderItem & { product: Product };

type OrderItemCardProps = {
  item: OrderItemWithProduct;
  orderId: number;
  editMode: boolean;
  expanded: boolean;
  onToggleExpand: () => void;
  onUpdate: (orderId: number, itemId: number, field: string, value: any) => void;
};

export default function OrderItemCard({
  item,
  orderId,
  editMode,
  expanded,
  onToggleExpand,
  onUpdate,
}: OrderItemCardProps) {
  return (
    <li className="mb-4">
      <div className="flex items-center justify-between">
        <span>
          {item.product?.name || "Unknown Product"} - ${item.price.toFixed(2)}
        </span>
        <Button onClick={onToggleExpand} variant="ghost" size="sm">
          {expanded ? "▲" : "▼"}
        </Button>
      </div>
      {expanded && (
        <div className="mt-2 pl-4">
          <p>Status: {item.status}</p>
          <p>Color Refinement: {item.colorRefinement ? "Yes" : "No"}</p>
          <p>Message: {item.message || ""}</p>
          <p>Add-on Item: {item.addOnItem ? "Yes" : "No"}</p>
        </div>
      )}
      {editMode && (
        <div className="mt-2 space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`colorRefinement-${item.id}`}
              checked={item.colorRefinement}
              onCheckedChange={(checked) =>
                onUpdate(orderId, item.id, "colorRefinement", checked)
              }
            />
            <Label htmlFor={`colorRefinement-${item.id}`}>Color Refinement</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Input
              id={`message-${item.id}`}
              value={item.message || ""}
              onChange={(e) =>
                onUpdate(orderId, item.id, "message", e.target.value)
              }
              placeholder="Message"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`addOnItem-${item.id}`}
              checked={item.addOnItem}
              onCheckedChange={(checked) =>
                onUpdate(orderId, item.id, "addOnItem", checked)
              }
            />
            <Label htmlFor={`addOnItem-${item.id}`}>Add-on Item</Label>
          </div>
        </div>
      )}
    </li>
  );
}
