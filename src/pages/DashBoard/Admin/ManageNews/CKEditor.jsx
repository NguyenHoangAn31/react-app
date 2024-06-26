import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
// import Editor from 'ckeditor5-custom-build/build/ckeditor';
import * as Editor from 'ckeditor5-custom-build/build/ckeditor';

import axios from 'axios';
import { Form, Button, Space } from 'antd';
// import React, { Component } from 'react';
// import { Box, styled } from '@mui/material'

// const BoxEditor = styled(Box) (({ theme }) => ({
//     '& .ck-editor_main > .ck-editor_editable': {
//         height: '300px',
//     },
// }));



export default function MyEditor(){
    return(
        // <BoxEditor>
            <CKEditor
                editor={ Editor }
                // config={ editorConfiguration }
                // data="<p>Hello from CKEditor&nbsp;5!</p>"
                onReady={ editor => {
                    // You can store the "editor" and use when it is needed.
                    console.log( 'Editor is ready to use!', editor );
                } }
                onChange={ ( event ) => {
                    console.log( event );
                } }
                onBlur={ ( event, editor ) => {
                    console.log( 'Blur.', editor );
                } }
                onFocus={ ( event, editor ) => {
                    console.log( 'Focus.', editor );
                } }
            />
        // </BoxEditor>
    )
}