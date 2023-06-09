import React, { useContext, useEffect, useState } from "react";
import { useObserver } from "mobx-react";
import { ReactComponent as Bold } from "../../assets/bold.svg";
import { ReactComponent as Underline } from "../../assets/underline.svg";
import { ReactComponent as Italic } from "../../assets/italic.svg";
import { ReactComponent as AlignLeft } from "../../assets/align-left.svg";
import { ReactComponent as AlignCenter } from "../../assets/align-center.svg";
import { ReactComponent as AlignRight } from "../../assets/align-right.svg";
import Slider from "../Slider";
import ColorPicker from "../ColorPicker";
import ToggleButton from "../ToggleButton";
import useStore from "../../hooks/useStore";


import { TextСonstants } from "../../stores/textStore";
import { DataContext } from "../../Context/DataContext";
const ToolbarText = () => {
  let {imageText, setImageText} = useContext(DataContext);
  const { textStore, objectManagerStore } = useStore();
  const [count, setCount] = useState(0);
  const options = [
    {
      icon:  <Bold />,
      name: "fontWeight",
      handler: () => textStore.toggleFontWeight(),
      isActive: (fontWeight: string) => fontWeight === "bold",
    },
    {
      icon:  <Underline />,
      name: "underline",
      handler: () => textStore.toggleTextDecoration(),
      isActive: (isUnderlined: any) => isUnderlined,
    },
    {
      icon:  <Italic />,
      name: "fontStyle",
      handler: () => textStore.toggleFontStyle(),
      isActive: (fontStyle: string) => fontStyle === "italic",
    },
    {
      icon:  <AlignLeft />,
      name: "textAlign",
      handler: () => textStore.setTextAlign("left"),
      isActive: (textAlign: string) => textAlign === "left",
    },
    {
      icon:  <AlignCenter />,
      name: "textAlign",
      handler: () => textStore.setTextAlign("center"),
      isActive: (textAlign: string) => textAlign === "center",
    },
    {
      icon:  <AlignRight />,
      name: "textAlign",
      handler: () => textStore.setTextAlign("right"),
      isActive: (textAlign: string) => textAlign === "right",
    },
  ];
  const fontStyles = [
    "Arial",
    "Arial Black",
    "Brush Script MT",
    "Calibri",
    "Courier",
    "Comic Sans MS",
    "Impact",
    "papyrus",
    "Noto",
    "Lucida Sans",
    "Roboto",
    "Times New Roman",
    "Tangerine",
    "Verdana",
    "Tahoma",
    "Serif",
    "Candara",
    "Goudy Old Style",
    "Perpetua",
    "Rockwell",
  ]
  useEffect(()=>{console.log("Context Data in ToolbarText: ")},[imageText])
  return useObserver(() => (
    <div className="toolbar__content">
      <button
        onClick={() => {
          textStore.setFontFamily("Roboto");
          try{
          if(count == 0){
            if(imageText.length>0){
              for(let i=0; i<imageText.length; i++){
                textStore.addText(
                  imageText[i].text, 
                  imageText[i].x, 
                  imageText[i].y, 
                  imageText[i].font_size
                  );
              }
            }
            setCount(count+1);
            setImageText([]);
          }
          else textStore.addText(null, null, null, null);
        }
        catch {
          textStore.addText(null, null, null, null);
        };
        }}
        className="toolbar__action-btn"
      >
        Add Text
      </button>
      {objectManagerStore.selectedObject ? (
        <>
        <div className="toolbar__options toolbar__options_three-col">
          {options.map((option, index) => {
            const optionValue = (textStore as any)[option.name];
            return (
              <div
                key={index}
                className={`toolbar__option ${
                  option.isActive(optionValue) ? "toolbar__option_active" : ""
                }`}
                onClick={option.handler}
              >
                {option.icon}
              </div>
            );
          })}
        </div>
        <select className="form-select form-select-sm" aria-label="Default select example" 
        onChange={(e)=>{
          // console.log(e.target.value); 
          textStore.setFontFamily(e.target.value)
          }}>
        {fontStyles.map((item, index)=>{
          return(
            <option value={item} selected={index==0 && true}>{item}</option>
          )
        })}
        </select>
        <Slider
          title="Size"
          value={textStore.fontSize}
          min={TextСonstants.MIN_FONT_SIZE}
          max={TextСonstants.MAX_FONT_SIZE}
          callback={value => {
            textStore.setFontSize(value);
          }}
        />
        <Slider
          title="Line height"
          value={textStore.lineHeight}
          min={TextСonstants.MIN_LINE_HEIGHT}
          max={TextСonstants.MAX_LINE_HEIGHT}
          callback={value => textStore.setLineHeight(value)}
        />
        <ColorPicker
          title="Colors"
          currentColorCode={textStore.fontColorCode}
          callback={rgbCode => textStore.setFontColor(rgbCode)}
        />
        <ToggleButton
          title="Background"
          checked={!textStore.isBgTransparent}
          callback={() => textStore.toggleBackground()}
        />
        {!textStore.isBgTransparent && (
          <ColorPicker
            currentColorCode={textStore.bgColorCode}
            callback={rgbCode => textStore.setBackgroundColor(rgbCode)}
          />
        )}
        <button
          className="toolbar__action-btn"
          onClick={() => objectManagerStore.deleteSelectedObject()}
        >
          Remove
        </button>
        </>
      ) : null}
    </div>
  ));
};

export default ToolbarText;