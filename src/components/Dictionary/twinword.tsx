
import React, { Fragment } from 'react';
import { TwinwordMeaning } from '../../context/types';

const Twinword = (props: any) => {
    const twinResult: TwinwordMeaning = props.twinResult;
    console.log(twinResult);
    return (
        <div>
            {
                (twinResult.result_msg !== '' && twinResult.result_msg !== 'Success') &&
                <p className="text-danger pt-4">{twinResult.result_msg}</p>
            }
            {twinResult.ipa &&
                <Fragment>
                    <h5 className="mb-4">{twinResult.ipa}</h5>
                    {/* <p>{twinResult.ipa}</p> */}

                </Fragment>
            }
            {
                (twinResult.meaning && (twinResult.meaning.noun !== '' ||
                    twinResult.meaning.adjective !== '' ||
                    twinResult.meaning.adverb !== '' ||
                    twinResult.meaning.verb !== '')
                ) &&
                <h5 className="mb-0 font-italic">Definition</h5>
            }
            {(twinResult.meaning && twinResult.meaning.noun && twinResult.meaning.noun !== '') &&
                <Fragment>
                    {twinResult.meaning.noun.split("\n").map(function (item, idx) {
                        return (
                            <span key={idx}>
                                {item}
                                <br />
                            </span>
                        )
                    })}
                </Fragment>
            }
            {(twinResult.meaning && twinResult.meaning.adjective && twinResult.meaning.adjective !== '') &&
                <Fragment>
                    {twinResult.meaning.adjective.split("\n").map(function (item, idx) {
                        return (
                            <span key={idx}>
                                {item}
                                <br />
                            </span>
                        )
                    })}
                </Fragment>
            }
            {(twinResult.meaning && twinResult.meaning.adverb && twinResult.meaning.adverb !== '') &&
                <Fragment>
                    {twinResult.meaning.adverb.split("\n").map(function (item, idx) {
                        return (
                            <span key={idx}>
                                {item}
                                <br />
                            </span>
                        )
                    })}
                </Fragment>
            }
            {(twinResult.meaning && twinResult.meaning.verb && twinResult.meaning.verb !== '') &&
                <Fragment>
                    {twinResult.meaning.verb.split("\n").map(function (item, idx) {
                        return (
                            <span key={idx}>
                                {item}
                                <br />
                            </span>
                        )
                    })}
                </Fragment>}
        </div>
    )
}

export default Twinword;
