import DrillDownTable from '@onaio/drill-down-table';
import * as React from 'react';
import { Column } from 'react-table';
import { FlexObject } from '../../../helpers/utils';

/** Interface to describe props for TableProps */
export interface TableProps {
  data: FlexObject[];
  columns: Column[];
  state?: any;
  debug?: boolean;
}
/** Interface to describe props for NullDataTable components  */
export interface NullDataTableProps {
  tableProps: TableProps;
  reasonType: string;
}
/** Component returns table with <th> with no data */
class NullDataTable extends React.Component<NullDataTableProps, {}> {
  constructor(props: NullDataTableProps) {
    super(props);
  }
  public render() {
    const { reasonType, tableProps } = this.props;
    return (
      <div>
        <h3 className="mb-3 mt-5 page-title">{reasonType}</h3>
        <DrillDownTable {...tableProps} NoDataComponent={(() => null) as any} />
        <h3 className="text-muted">No Investigations Found</h3>
        <hr />
      </div>
    );
  }
}
export default NullDataTable;
