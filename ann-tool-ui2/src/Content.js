import "./Content.css";
import React from "react";
import Skeleton from '@material-ui/lab/Skeleton';
import { useLocation } from "react-router";

export default function Content(props) {
  let start = 0;
  let end = 0;
  function generateContent(arr) {
    let gen = [];
    let temp = [];
    for (let [index, item] of arr.entries()) {
      if (!item["marked"]) {
        if (temp.length !== 0) {
          gen.push(
            <mark>
              <span
                onClick={deleteTag}
                className="delete"
                start={temp.at(0)[0]}
                end={temp.at(-1)[0]}
              >
                x
              </span>
              {temp.map((x) => addWhitespace(x[1]))}
              <span className="selectedTag">{temp[0][1]["tag"]}</span>
            </mark>
          );
          temp = [];
        }
        gen.push(addWhitespace(item));
      } else {
        temp.push([index, item]);
      }
    }
    if (temp.length !== 0) {
      gen.push(<mark> {temp.map((x) => addWhitespace(x))} </mark>);
      temp = [];
    }
    return gen;
  };

  function deleteTag(event) {
    let start = event.target.getAttribute("start");
    let end = event.target.getAttribute("end");
    props.setArr([...props.children].map((x, i) => {
      if (i >= start && i <= end) {
        return {
          ...x,
          'marked': false,
        }
      }
      else {
        return x
      }
    }))
  };

  function addWhitespace(x) {
    if (x["whitespace"] && !x["space"]) {
      return (
        <span id={x["id"]}>
          {x["text"]}{" "}
        </span>
      );
    } else if (!x["space"]) {
      return (
        <span id={x["id"]}>
          {x["text"]}
        </span>
      );
    } else {
      return (
        <span id={x["id"]}>
          {x["text"].replaceAll("\\n", "\n")}{" "}
        </span>
      );
    }
  };

  function downCapture(event) {
    start = Number(event.target.id);
  };

  function upCapture(event) {
    end = Number(event.target.id);
    let tag = props.getSelectedTag();
    let text = window.getSelection().toString();
    if (start !== end || text !== "") {
      if (start > end) {
        let t = start;
        start = end;
        end = t;
      }
      props.setArr([...props.children].map((x, i) => {
        if (i >= start && i <= end) {
          return {
            ...x,
            "marked": true,
            'tag': tag,
          }
        }
        else {
          return x
        }
      }))
    }
    window.getSelection().empty();
  };

  return (props.children.length !==0 ? <div className="text-area-container">
    <div
      class="text-area"
      onMouseDownCapture={downCapture}
      onMouseUpCapture={upCapture}
    >
      {generateContent(props.children)}

    </div>
  </div> : <div><Skeleton variant="rect" width={210} height={118}></Skeleton></div>);
}