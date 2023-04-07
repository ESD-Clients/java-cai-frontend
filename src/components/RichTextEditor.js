import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';

Quill.register('modules/imageResize', ImageResize);

// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import { ImageResize } from 'quill-image-resize-module';

const tools = {
  toolbar: [
    [{ 'header': [] }, { 'font': [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' }
    ],
    [
      'link', 
      'image', 
      // 'file'
      // 'video'
    ],
    ['clean']
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
  imageResize: {
    parchment: Quill.import('parchment'),
    modules: ['Resize', 'DisplaySize']
  },
}
export default function RichTextEditor ({label, width, required, value, onChange}) {

  return (
    <div className={"text-white form-control w-full " + (
      width ? (`max-w-${width}`) : ""
    )}>
      {
        label && (
          <label className="label justify-start">
            <span className="label-text">{label}</span>
            {required && <span className="text-red-500 ml-2">*</span>}
          </label>
        )
      }
      <div className="editor">
        <ReactQuill
          theme="snow"
          onChange={onChange}
          value={value}
          modules={tools}
          className="rich-text-editor text-black"
        />
      </div>
    </div>
  )
}