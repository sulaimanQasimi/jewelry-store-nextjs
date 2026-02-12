import React, { forwardRef } from "react";
import Barcode from "react-barcode";

const BarcodePrint = forwardRef(({ product }, ref) => {
  return (
    <div
      ref={ref}
      className="w-[5cm] h-[2.5cm] p-1 text-center"
      style={{ direction: "rtl" }}
    >
      <p className="text-sm font-bold">صداقت</p>

      <Barcode
        value={product.barcode}
        format="CODE128"
        width={1}
        height={40}
        displayValue={true}
        fontSize={12}
        margin={0}
      />

      <div className="text-xs mt-1">
        <span>{product.gram} گرام</span> | <span>{product.karat} عیار</span>
      </div>
    </div>
  );
});

export default BarcodePrint;
