import React, { useState } from 'react';
import { Model } from '../../helpers/Model';
import { FilesView } from './FilesView';
import { Repo } from './Repo';

export const ResultView = (props) => {

    const { query, ignoreCase, results, error } = props;
    const regexp = new RegExp(query.trim(), ignoreCase.trim() === 'fosho' && 'ig' || 'g');
    const isLoading = results === null && query;
    const noResults = !!results && results.length === 0;

    if (error) {
        return (
            <div id="no-result" className="error">
                <strong>ERROR:</strong>{ error }
            </div>
        );
    }

    if (!isLoading && noResults) {
        // TODO(knorton): We need something better here. :-(
        return (
            <div id="no-result">
                &ldquo;Nothing for you, Dawg.&rdquo;<div>0 results</div>
            </div>
        );
    }
/*
    const openOrCloseAll = (to_open) => {
        for (let index in reposShowState) {
            let [state, setState] = reposShowState[index]
            if (to_open) {
                setState(true)
            } else {
                setState(false)
            }
        }
    }
*/
    const openOrCloseAll = (to_open) => {
        for (let index in reposRefs) {
            let repo = reposRefs[index]
            if (to_open) {
                repo.openFiles()
            } else {
                repo.closeFiles()
            }
        }
    }
    const openAll = () => {
        openOrCloseAll(true)
    }
    const closeAll = () => {
        openOrCloseAll(false)
    }

    const actions = results && results.length ? (
            <div className="actions">
              <button onClick={ openAll }><span className="octicon octicon-chevron-down"></span> Expand all</button>
              <button onClick={ closeAll }><span className="octicon octicon-chevron-right"></span> Collapse all</button>
            </div>
    ) : ""

    const reposRefs = {}
    const repos = results
          ? results.map((result, index) => {
/*
              let state = useState(true)
              reposShowState[index] = state
*/
              return (
            <Repo key={"repo-"+index}
                  ref={ ref => reposRefs[index] = ref}
                  matches={result.Matches}
                  rev={result.Rev}
                  repo={result.Repo}
                  regexp={regexp}
                  files={result.FilesWithMatch}/>
              )
          }) : '';

    return (
        <div id="result">
            <div id="no-result" className={ isLoading && 'loading' || 'hidden' }>
                <img src="images/busy.gif" /><div>Searching...</div>
            </div>
            { actions }
            { repos }
        </div>
    );
};
