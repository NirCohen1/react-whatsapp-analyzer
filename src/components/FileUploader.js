import React, { useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';
import axios from 'axios';

import OrbitProgress from 'react-loading-indicator';


export default function FileUploader() {
    const toast = useRef(null);
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef(null);
    const files = useRef(null)
    const hidden = useRef(true)
    
    const onTemplateSelect = (e) => {
        let _totalSize = totalSize;
        // let files = e.files;
        files.current = e.files

        console.log(files.current)

        if(files.current){
            for (let i = 0; i < files.current.length; i++) {
                _totalSize += files.current[i].size || 0;
            }
            setTotalSize(_totalSize);
        }

        // Object.keys(files.current).forEach((key) => {
        //     _totalSize += files.current[key].size || 0;
        // });
        // setTotalSize(_totalSize);
    };

    const onTemplateUpload = (e) => {
        let _totalSize = 0;

        e.files.forEach((file) => {
            _totalSize += file.size || 0;
            sentToAnalysis(file); // maybe only 1 file
        });

        setTotalSize(_totalSize);
        
    };

    const sentToAnalysis = async (file) => {
        // let done = false;
        hidden.current = false;

        axios.post(process.env.REACT_APP_API_URL, file, {
            headers: {
              'Content-Type': file.type
            }
        }).then(()=>{
            toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
        })
        .catch((err)=>{
            console.log("Error while fetching: " + err);
            hidden.current = true;
            toast.current.show({ severity: 'info', summary: 'Error', detail: 'Error while fetching' });
        })
    }

    const onTemplateRemove = (file, callback) => {
        setTotalSize(totalSize - file.size);
        callback();
    };

    const onTemplateClear = () => {
        setTotalSize(0);
    };

    const headerTemplate = (options) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
        const value = totalSize / 10000;
        const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';

        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                {uploadButton}
                {cancelButton}
                <div className="flex align-items-center gap-3 ml-auto">
                    <span>{formatedValue} / 1 MB</span>
                    <ProgressBar value={value} showValue={false} style={{ width: '10rem', height: '12px' }}></ProgressBar>
                </div>
            </div>
        );
    };

    const itemTemplate = (file, props) => {
        return (
            <div className="flex align-items-center flex-wrap">
                <div className="flex align-items-center" style={{ width: '40%' }}>
                    <img alt={file.name} role="presentation" src={file.objectURL} width={100} />
                    <span className="flex flex-column text-left ml-3">
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
                <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onTemplateRemove(file, props.onRemove)} />
            </div>
        );
    };

    const emptyTemplate = () => {
        files.current = null; //

        return (
            <div className="flex align-items-center flex-column">
                <i className="pi pi-image mt-3 p-5" style={{ fontSize: '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i>
                <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="my-5">
                    Drag and Drop txt Here
                </span>
            </div>
        );
    };

    const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
    const uploadOptions = { icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined' };
    const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };

    return (
        <div>
            <Toast ref={toast}></Toast>

            <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
            <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
            <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />
            


            <FileUpload ref={fileUploadRef} name="demo[]" url="/api/upload" multiple accept="txt/*" maxFileSize={1000000}
                onUpload={onTemplateUpload} onSelect={onTemplateSelect} onError={onTemplateClear} onClear={onTemplateClear}
                headerTemplate={headerTemplate} itemTemplate={itemTemplate} emptyTemplate={emptyTemplate}
                chooseOptions={chooseOptions} uploadOptions={uploadOptions} cancelOptions={cancelOptions} />

            <div className={ hidden.current ? 'hide': 'results' }>
                {
                    files.current && Object.keys(files.current).map((key) => {
                            console.log(key);
                            console.log(files.current[key].name)
                            return (
                            <>
                            <div>
                                <table id="results">
                                    <thead>
                                        <tr>
                                            <th>
                                                {files.current[key].name}
                                            </th>
                                            <th>
                                                <OrbitProgress className="custom-orbit-progress" variant="split-disc" color="#32cd32" size="medium" text="on progress" textColor="#32cd32" style={{stroke: 'rgba(50, 205, 50, 1)'}} />
                                            </th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                            </>
                            )
                        }
                    )
                }
            </div>
                            
                {/* <div className={ hidden.current ? 'hide': 'results' }>
                    {
                        files.current && Object.keys(files.current).map((key) => {
                                console.log(hidden.current);
                                return (
                                    <>
                                        <th>
                                            {files.current[key].name}
                                        </th>
                                        <th>
                                            <OrbitProgress className="custom-orbit-progress" variant="split-disc" color="#32cd32" size="medium" text="Processing" textColor="#32cd32" style={{stroke: 'rgba(50, 205, 50, 1)'}} />
                                            <div>Processing</div>
                                        </th>
                                    </>
                                )
                            }
                        )
                    }
                </div> */}
            
        </div>
    )
}
        