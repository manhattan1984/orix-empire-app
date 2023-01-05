import { Create, Datagrid, Edit, EditButton, List, NumberField, NumberInput, SimpleForm, TextField, TextInput } from 'react-admin';

export const ProductList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="name" />
            <NumberField source="stock" />
            <NumberField source="price" />
            <EditButton />
        </Datagrid>
    </List>
);

export const ProductEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source='name' />
            <TextInput source='stock' />
            <TextInput source="price" />
        </SimpleForm>
    </Edit>
)

export const ProductCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source='name' />
            <NumberInput source='stock' />
            <NumberInput source="price" />
        </SimpleForm>
    </Create>
);