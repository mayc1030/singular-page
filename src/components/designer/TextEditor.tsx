import React, { useState, useEffect } from 'react';
import type { FabricObject, IText } from 'fabric';
import { FONT_OPTIONS } from '../../data/fonts';
import { Slider } from '../common/Slider';
import { ColorPicker } from '../common/ColorPicker';
import { COLOR_PALETTE } from '../../data/colors';
import { Bold, Italic, AlignLeft, AlignCenter, AlignRight, Type } from 'lucide-react';

export interface TextEditorProps {
  selectedObject: FabricObject | null;
  onUpdateText: (props: Record<string, unknown>) => void;
}

export const TextEditor: React.FC<TextEditorProps> = ({
  selectedObject,
  onUpdateText
}) => {
  const isText = selectedObject && (selectedObject.type === 'i-text' || selectedObject.type === 'text');
  const textObj = isText ? (selectedObject as IText) : null;

  const [text, setText] = useState<string>(textObj?.text || '');
  const [fontFamily, setFontFamily] = useState<string>(textObj?.fontFamily || 'Inter');
  const [fontSize, setFontSize] = useState<number>(textObj?.fontSize || 28);
  const [fillColor, setFillColor] = useState<string>((textObj?.fill as string) || '#FFFFFF');
  const [isBold, setIsBold] = useState<boolean>(textObj?.fontWeight === 'bold');
  const [isItalic, setIsItalic] = useState<boolean>(textObj?.fontStyle === 'italic');
  // Tipo explícito para textAlign — evita cast `as any`
  type TextAlignValue = 'left' | 'center' | 'right';
  const [align, setAlign] = useState<TextAlignValue>((textObj?.textAlign as TextAlignValue) || 'center');
  const [charSpacing, setCharSpacing] = useState<number>(textObj?.charSpacing || 0);

  useEffect(() => {
    if (textObj) {
      setText(textObj.text || '');
      setFontFamily(textObj.fontFamily || 'Inter');
      setFontSize(textObj.fontSize || 28);
      setFillColor((textObj.fill as string) || '#FFFFFF');
      setIsBold(textObj.fontWeight === 'bold');
      setIsItalic(textObj.fontStyle === 'italic');
      setAlign((textObj.textAlign as TextAlignValue) || 'center');
      setCharSpacing(textObj.charSpacing || 0);
    }
  }, [selectedObject]);

  if (!isText) {
    return (
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-center text-xs text-slate-400">
        <Type size={24} className="mx-auto text-slate-600 mb-2" />
        <span>Selecciona o agrega un elemento de texto en la prenda para habilitar los ajustes tipográficos.</span>
      </div>
    );
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setText(val);
    onUpdateText({ text: val });
  };

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const font = e.target.value;
    setFontFamily(font);
    onUpdateText({ fontFamily: font });
  };

  const handleSizeChange = (val: number) => {
    setFontSize(val);
    onUpdateText({ fontSize: val });
  };

  const handleColorChange = (colId: string) => {
    const found = COLOR_PALETTE.find((c) => c.id === colId);
    if (found) {
      setFillColor(found.hex);
      onUpdateText({ fill: found.hex });
    }
  };

  const toggleBold = () => {
    const next = !isBold;
    setIsBold(next);
    onUpdateText({ fontWeight: next ? 'bold' : 'normal' });
  };

  const toggleItalic = () => {
    const next = !isItalic;
    setIsItalic(next);
    onUpdateText({ fontStyle: next ? 'italic' : 'normal' });
  };

  const handleAlign = (newAlign: 'left' | 'center' | 'right') => {
    setAlign(newAlign);
    onUpdateText({ textAlign: newAlign });
  };

  const handleSpacing = (val: number) => {
    setCharSpacing(val);
    onUpdateText({ charSpacing: val });
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl animate-fade-in">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
        <Type size={16} className="text-orange-400" />
        <span>Edición de Texto Seleccionado</span>
      </div>

      {/* Input Field */}
      <input
        type="text"
        value={text}
        onChange={handleTextChange}
        placeholder="Escribe tu texto..."
        className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm font-semibold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
      />

      {/* Font Selector & Styles bar */}
      <div className="flex items-center gap-2">
        <select
          value={fontFamily}
          onChange={handleFontChange}
          className="flex-1 bg-slate-950 border border-slate-700 text-slate-100 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
        >
          {FONT_OPTIONS.map((f) => (
            <option key={f.family} value={f.family} style={{ fontFamily: f.family }}>
              {f.name}
            </option>
          ))}
        </select>

        <div className="flex items-center bg-slate-950 border border-slate-700 rounded-xl p-1 gap-1">
          <button
            onClick={toggleBold}
            className={`p-1.5 rounded-lg transition-colors ${
              isBold ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bold size={15} />
          </button>
          <button
            onClick={toggleItalic}
            className={`p-1.5 rounded-lg transition-colors ${
              isItalic ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Italic size={15} />
          </button>
        </div>
      </div>

      {/* Alignment Bar */}
      <div className="flex items-center justify-between gap-2 p-1 bg-slate-950 border border-slate-700 rounded-xl">
        <span className="text-xs font-semibold text-slate-400 ml-2">Alineación:</span>
        <div className="flex gap-1">
          <button
            onClick={() => handleAlign('left')}
            className={`p-1.5 rounded-lg transition-colors ${
              align === 'left' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlignLeft size={15} />
          </button>
          <button
            onClick={() => handleAlign('center')}
            className={`p-1.5 rounded-lg transition-colors ${
              align === 'center' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlignCenter size={15} />
          </button>
          <button
            onClick={() => handleAlign('right')}
            className={`p-1.5 rounded-lg transition-colors ${
              align === 'right' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlignRight size={15} />
          </button>
        </div>
      </div>

      {/* Font Size Slider */}
      <Slider label="Tamaño de Fuente" value={fontSize} min={12} max={96} onChange={handleSizeChange} unit="px" />

      {/* Letter Spacing */}
      <Slider label="Espaciado de Letras" value={charSpacing} min={-50} max={300} step={10} onChange={handleSpacing} />

      {/* Color Picker */}
      <ColorPicker
        colors={COLOR_PALETTE}
        selectedColorId={COLOR_PALETTE.find((c) => c.hex.toLowerCase() === fillColor.toLowerCase())?.id || 'white'}
        onChange={handleColorChange}
        label="Color del Texto"
      />
    </div>
  );
};
