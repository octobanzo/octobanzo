import { NextPage } from 'next';
import { Header } from '@octobanzo/components';

interface Props {}

const IndexPage: NextPage<Props> = (props) => {
    return (
        <div>
            <Header />
            <h1>Hello</h1>
        </div>
    );
};

export default IndexPage;
