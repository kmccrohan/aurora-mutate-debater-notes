import React from "react";
import { deSerialize, serialize, serPreview, getSearchableText } from "./util";
import "./style.css";

const MUTATION_NAME = "DebaterNote";
const HEADERS = ["1AC", "1NC", "2AC", "2NC", "1NR", "1AR", "2NR", "2AR"];

function debaterNote(ContentView, api) {
  return class extends React.Component {
    finishedLoadingContent = () => {
      this.props.note.getContent().then(content => {
        const editorState = deSerialize(content[this.props.note.mutationName]);
        this.props.onContentLoaded(editorState);
      });
    };

    onChange = (editorState, save) => {
      const serializedContent = serialize(editorState);
      const serializedPreview = serPreview(editorState);
      const searchableText = getSearchableText(editorState);

      this.props.onChange(
        editorState,
        serializedContent,
        serializedPreview,
        searchableText,
        save
      );
    };

    onSingleChange = (state, index) => {
      const editorState = this.props.ourEditorState;
      editorState.editors[index] = state;
      this.onChange(editorState);
    };

    render() {
      if (this.props.note && this.props.note.mutationName === MUTATION_NAME) {
        const {
          onChange,
          isLoadingContent,
          ourEditorState,
          ...props
        } = this.props;
        const Editor = api().Editor;
        const editors = this.props.ourEditorState.editors.map((col, index) => {
          if (index == 0) {
            return (
              <div className={"d-column"} key={"editor-div" + index}>
                <div className={"d-column-header"} key={"header" + index}>
                  {HEADERS[index]}
                </div>
                <Editor
                  key={"editor" + index}
                  ourEditorState={col}
                  onChange={editorState => {
                    this.onSingleChange(editorState, index);
                  }}
                  placeholder={"Type here"}
                  isLoadingContent={isLoadingContent}
                  finishedLoadingContent={this.finishedLoadingContent}
                  {...props}
                />
              </div>
            );
          } else {
            return (
              <div
                className={"d-column d-not-first-editor"}
                key={"editor-div" + index}>
                <div className={"d-column-header"} key={"header" + index}>
                  {HEADERS[index]}
                </div>
                <Editor
                  key={"editor" + index}
                  ourEditorState={col}
                  onChange={editorState => {
                    this.onSingleChange(editorState, index);
                  }}
                  placeholder={"Type here"}
                  {...props}
                />
              </div>
            );
          }
        });
        return <div className="d-editor-container">{editors}</div>;
      }
      return <ContentView {...this.props} />;
    }
  };
}

module.exports.mutations = {
  ContentView: debaterNote
};
