import React, { useState, useEffect } from "react";
import { useSupplierCart } from "../../context/SupplierProduct";

/* ================== utils ================== */
const convertToEnglish = (str = "") => {
  const map = {
    "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4",
    "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9",
    "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4",
    "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9"
  };
  return String(str).replace(/[۰-۹٠-٩]/g, d => map[d]);
};

const numericFields = [
  "weight",
  "karat",
  "pasaReceipt",
  "wagePerGram",
  "wageReceipt"
];

/* ================== component ================== */
const SupplierPrice = ({ showProduct, setShowProduct }) => {
  const { supplierCart, setSupplierCart } = useSupplierCart();

  const [form, setForm] = useState({
    name: "",
    type: "",
    karat: "",
    weight: "",
    pasa: "",
    pasaReceipt: "",
    pasaRemaining: "",
    wagePerGram: "",
    totalWage: "",
    wageReceipt: "",
    wageRemaining: ""
  });

  /* ---------- change handler ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    let cleanValue = value;

    if (numericFields.includes(name)) {
      cleanValue = convertToEnglish(value);
    }

    setForm(prev => ({
      ...prev,
      [name]: cleanValue
    }));
  };

  /* ---------- calculations ---------- */
  useEffect(() => {
    const weight = Number(form.weight) || 0;
    const karat = Number(form.karat) || 0;
    const pasaReceipt = Number(form.pasaReceipt) || 0;
    const wagePerGram = Number(form.wagePerGram) || 0;
    const wageReceipt = Number(form.wageReceipt) || 0;

    // پاسه
    const pasa =
  weight && karat
    ? (weight * ((karat * 100 + 12) / 100)) / 23.88
    : 0;


    const pasaRemaining = pasa - pasaReceipt;

    // وجوره
    const totalWage = weight * wagePerGram;
    const wageRemaining = totalWage - wageReceipt;

    setForm(prev => ({
      ...prev,
      pasa: pasa ? pasa.toFixed(3) : "",
      pasaRemaining: pasa ? pasaRemaining.toFixed(3) : "",
      totalWage: totalWage ? totalWage.toFixed(2) : "",
      wageRemaining: totalWage ? wageRemaining.toFixed(2) : ""
    }));
  }, [
    form.weight,
    form.karat,
    form.pasaReceipt,
    form.wagePerGram,
    form.wageReceipt
  ]);

  /* ---------- save ---------- */
  const saveToCart = () => {
    if (!form.name || !form.karat || !form.weight) {
      alert("لطفاً نام، عیار و وزن را وارد کنید");
      return;
    }

    const newProduct = {
      name: form.name,
      type: form.type,
      karat: Number(form.karat),
      weight: Number(form.weight),
      pasa: Number(form.pasa),
      pasaReceipt: Number(form.pasaReceipt) || 0,
      pasaRemaining: Number(form.pasaRemaining),
      wagePerGram: Number(form.wagePerGram) || 0,
      totalWage: Number(form.totalWage),
      wageReceipt: Number(form.wageReceipt) || 0,
      wageRemaining: Number(form.wageRemaining)
    };

    setSupplierCart(prev => [...prev, newProduct]);

    setForm({
      name: "",
      type: "",
      karat: "",
      weight: "",
      pasa: "",
      pasaReceipt: "",
      pasaRemaining: "",
      wagePerGram: "",
      totalWage: "",
      wageReceipt: "",
      wageRemaining: ""
    });

    setShowProduct(false);
  };

  /* ---------- UI ---------- */
  return (
    <div className="bg-white px-8 pt-12 pb-4 rounded w-[90%] max-h-[80%] overflow-y-auto relative z-50">
      <div className="grid grid-cols-4 gap-8">

        <Field label="نام جنس">
          <input name="name" className="border border-gray-500 py-0.5 px-2 rounded-xs"  value={form.name} onChange={handleChange} />
        </Field>

        <Field label="نوعیت جنس">
          <input name="type" className="border border-gray-500 py-0.5 px-2 rounded-xs"  value={form.type} onChange={handleChange} />
        </Field>

        <Field label="عیار">
          <select name="karat" value={form.karat} onChange={handleChange}>
            <option value="">انتخاب عیار</option>
            <option value="14">14</option>
            <option value="18">18</option>
            <option value="21">21</option>
          </select>
        </Field>

        <Field label="وزن">
          <input name="weight" className="border border-gray-500 py-0.5 px-2 rounded-xs"  value={form.weight} onChange={handleChange} inputMode="numeric" />
        </Field>

        <Field label="پاسه">
          <input name="pasa" className="border border-gray-500 py-0.5 px-2 rounded-xs"  value={form.pasa} readOnly />
        </Field>

        <Field label="رسید پاسه">
          <input name="pasaReceipt" className="border border-gray-500 py-0.5 px-2 rounded-xs"  value={form.pasaReceipt} onChange={handleChange} />
        </Field>

        <Field label="صرف باقی پاسه">
          <input name="pasaRemaining" className="border border-gray-500 py-0.5 px-2 rounded-xs"  value={form.pasaRemaining} readOnly />
        </Field>

        <Field label="وجوره هر گرم">
          <input name="wagePerGram" className="border border-gray-500 py-0.5 px-2 rounded-xs"  value={form.wagePerGram} onChange={handleChange} />
        </Field>

        <Field label="مجموع وجوره">
          <input name="totalWage"  className="border border-gray-500 py-0.5 px-2 rounded-xs" value={form.totalWage} readOnly />
        </Field>

        <Field label="رسید وجوره">
          <input name="wageReceipt" className="border border-gray-500 py-0.5 px-2 rounded-xs"  value={form.wageReceipt} onChange={handleChange} />
        </Field>

        <Field label="صرف باقی وجوره">
          <input name="wageRemaining" className="border border-gray-500 py-0.5 px-2 rounded-xs"  value={form.wageRemaining} readOnly />
        </Field>

      </div>

      <div className="flex gap-4 justify-center my-8">
        <button onClick={() => setShowProduct(false)} className="bg-red-600 w-40 text-white">
          لغو
        </button>
        <button onClick={saveToCart} className="bg-green-600 w-40 text-white">
          ذخیره
        </button>
      </div>
    </div>
  );
};

/* ================== field ================== */
const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1">
    <p className="text-sm">{label}</p>
    {children}
  </div>
);

export default SupplierPrice;
