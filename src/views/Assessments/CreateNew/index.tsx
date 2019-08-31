import ApolloError from '@src/components/ApolloError';
import CourseTile from '@src/components/CourseTile';
import Input, { default as InputField } from '@src/components/Form/Input';
import Select from '@src/components/Form/Select';
import {default as SelectQueryField} from '@src/components/Form/SelectFromQuery';
import Loader from '@src/components/Loader';
import { IAssesment, IAssesmentTopic, IBatch, ICourse, IInvitation, IModule, ITopic } from '@src/model-types';
import ASSESSMENT_LISTING from '@src/queries/assessment-listing.graphql';
import BATCHES from '@src/queries/batches-listing.graphql';
import COURSES from '@src/queries/course-listing.graphql';
import CREATE_ASSESSMENT from '@src/queries/create-assessment.graphql';
import TOPICS from '@src/queries/topic-listing.graphql';

import { format } from 'fecha';
import { Field, Form, Formik, FormikBag, FormikProps } from 'formik';
import * as React from 'react';
import { Component } from 'react';
import { Mutation } from 'react-apollo';
import { Query } from 'react-apollo';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import './style.scss';
import {errorComparator} from 'tslint/lib/verify/lintError';
import {Redirect} from 'react-router';

interface IFormData {
  id?: string;
  name: string;
  topics: IAssesmentTopic[];
  batch: string;
  durationMinutes: number;
  startDate: string;
  endDate: string;
}
interface ICourseListItem {
  id: string;
  name: string;
  category: string;
  selected: boolean;
}
interface IModuleListItem {
  id: string;
  name: string;
  category: string;
  selected: boolean;
}
interface ITopicListItem {
    id: string;
    name: string;
    selected: boolean;
    theoryCount: number;
    practicalCount: number;
}
interface ICourseProps {
  onCourseSelect: (index, event) => {};
  courses: ICourseListItem[];
}

interface IModuleProps {
  onModuleSelect: (id) => {};
  modules: IModuleListItem[];
}
interface ITopicProps {
    onTopicSelect: (index, value) => {};
    topics: ITopicListItem[];
}
interface ISelectedTopicProps {
    onTopicDelete: (index, value) => {};
    topics: ITopicListItem[];
}
const CourseList = (props: ICourseProps) => (
    <div styleName="course-container">
        <div styleName="list-content">
            <h2>Domain Courses</h2>
            {props.courses.map((c) => (
                <div key={c.id}>
                    {c.category === 'domain' && <label>
                        <input name="domain" type="radio" onChange={(e) => {props.onCourseSelect(props.courses.indexOf(c), e); }} />
                        <span> {c.name}</span>
                    </label>}
                </div>
            ))}
        </div>

        <div styleName="list-content">
            <h2>Non-Domain Courses</h2>
            {props.courses.map((c) => (
                <div key={c.id}>
                    {c.category === 'non-domain' && <label>
                        <input name="non-domain" type="checkbox" onChange={(e) => {props.onCourseSelect(props.courses.indexOf(c), e); }} />
                        <span> {c.name}</span>
                    </label>}
                </div>
            ))}
        </div>
    </div>
);

const ModuleList = (props: IModuleProps) => (
    <div styleName="course-container">
        <div styleName="list-content">
            <h2>Domain Modules</h2>
            {props.modules.map((m) => (
                <div key={m.id}>
                    {m.category === 'domain' && <label>
                        <input name="domain" type="radio" onChange={(e) => {props.onModuleSelect(m.id); }} />
                        <span> {m.name}</span>
                    </label>}
                </div>
            ))}
        </div>

        <div styleName="list-content">
            <h2>Non-Domain Modules</h2>
            {props.modules.map((m) => (
                <div key={m.id}>
                    {m.category === 'non-domain' && <label>
                        <input name="non-domain" type="radio" onChange={(e) => {props.onModuleSelect(m.id); }} />
                        <span> {m.name}</span>
                    </label>}
                </div>
            ))}
        </div>
    </div>
);

const TopicList = (props: ITopicProps) => (
        <div styleName="content">
            <h2>Topics</h2>
            {console.log('topic props ', props)}
            {props.topics.map((t) => (
                <div key={t.id}>
                     <label>
                        <input name="non-domain" type="radio" onChange={(e) => {props.onTopicSelect(props.topics.indexOf(t), e);}} />
                        <span> {t.name}</span>
                    </label>
                </div>
            ))}
        </div>
);
const SelectedTopicList = (props: ISelectedTopicProps) => (
    <div styleName="content">
        <h2>Selected Topics</h2>
        {props.topics.map((t) => (
            <div key={t.id}>
                {t.selected &&
                <div styleName="selected-topics-list">
                    <div styleName="topic-name">
                    <h3 styleName="select-topic"> {t.name}</h3>
                    </div>
                    <div styleName="delete-btn">
                    <i
                        styleName="delete"
                        title="Delete"
                        onClick={()=>{props.onTopicDelete(props.topics.indexOf(t))}}
                    />
                    </div>
                </div>}
            </div>
        ))}
    </div>
);

const topicsSchema = yup
    .array()
    .of(
        yup.object().shape({
            topic: yup
                .string()
                .required(),
            theoryCount: yup.number().required('Required'),
            practicalCount: yup.number().required('Required')

        })
    )
    .nullable(true);

const validationSchema = yup.object().shape({
    name: yup
        .string()
        .required('Name is required'),
    startDate: yup.date().min(new Date(), 'Can not create already expired invitation'),
    endDate: yup.date().min(new Date(), 'Can not create already expired invitation'),
    durationMinutes:yup.string(),
    topics:topicsSchema,
    batch: yup.string()
});

const handleCreateAssessment = (mutation) => (
    values: IFormData,
    { setStatus, setSubmitting, resetForm }: FormikBag<IFormData, {}>
) => {
    console.log('data to save', values);
    setSubmitting(true);
    mutation({
        variables: values,
        update: (cache, { data: { createAssessment: assessment } }) => {
            // const { assessments } = cache.readQuery({ query: ASSESSMENT_LISTING });
            // cache.writeQuery({
            //     query: ASSESSMENT_LISTING,
            //     data: { assessments: assessments.concat(assessment) }
            // });
        }
    })
        .then((res) => {
          setSubmitting(false);
          resetForm();
          toast('Created new Assessment', { type: 'success' })
            location.href="/assessments";
        })
        .catch((err) => {
          setSubmitting(false);
          setStatus(err);
        });
};

const InnerForm = (formData: FormikProps<IFormData>) => (
    <Form styleName="form-container">
        <Field
            name="batch"
            label="Batches"
            component={SelectQueryField}
            dataNodeName="batches"
            query={BATCHES}
            displayOption={(d) => `${d.name}`}
        />
        <Field name="name" type="text" label="Assessment Name" component={InputField} />
        <Field name="startDate" type="date" label="Start Date" component={InputField} />
        <Field name="endDate" type="date" label="End Date" component={InputField} />
        <Field name="durationMinutes" type="text" label="Duration In Minutes" component={InputField} />

        {formData.status && <ApolloError error={formData.status} />}
        <button className="btn-primary">Save</button>
    </Form>
);


interface ICreateAssessmentProps {
    assessment?: IAssesment;
    topics?: IAssesmentTopic[];
}

const CreateNewAssessment = (props: ICreateAssessmentProps) => {
    let initialValues = {
        id: undefined,
        name: '',
        topics: props.topics || [],
        batch: '',
        durationMinutes: 0,
        startDate: '',
        endDate: ''
    };
    let mutation = CREATE_ASSESSMENT;
    let handleMutation = handleCreateAssessment;
    return (
        <Mutation mutation={mutation}>
            {(mutationFunc, { loading, error }) => (
                <div>
                    <Loader isVisible={loading} />
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleMutation(mutationFunc)}
                        render={InnerForm}
                    />

                </div>
            )}
        </Mutation>
    );
};

class CreateAssessment extends Component {
  private courses = [];
  private modules = [];
  private selectedCourses = [];
  private topics = [];

  public state = { step:1 , moduleId: 0, topicIndex: -1, selectedTopics: [], topicsPayload: []};
  private getCourseList = (courses: []) => {
    courses.map((c) => {
      this.courses.push({
        id: c.id,
        name: c.name,
        category: c.category,
        modules:c.modules,
        selected: false
      });
    });
  }
  public onCourseSelect = (index, value) => {
    console.log(`value of index ${index}`, value.target.checked);
    this.courses[index].selected = value.target.checked;
  }
    public onModuleSelect = (value) => {
        console.log(`value of `, value);
        this.setState({moduleId: value});
    }
    public onTopicSelect = (index ,value) => {
        console.log(`value of `, index);
        // this.topics[index].selected = value.target.checked;?
        this.setState({topicIndex:index});

    }
  getSelectedCourses = () => {
    this.courses.map((c) => {
      if (c.selected) {
        this.selectedCourses.push(c);
        c.modules.map((m) => {
          this.modules.push({
            id: m.id,
            name: m.name,
            category: c.category,
            selected: false
          });
        });
      }
    });
  }
private getTopicsList = (topics:[]) => {
  this.topics = [];
  topics.map((t) => {
    this.topics.push({
      id: t.id,
      name: t.name,
      selected: false,
      theoryCount: 0,
      practicalCount: 0,
    });
  });
}
  public nextStep = (step) => {
    this.setState({step});
    if (step === 2) {
      this.getSelectedCourses();
    }
    if(step === 3) {
        let stopics = []
        this.state.selectedTopics.map((st)=> {
            stopics.push({
                topic:st.id,
                theoryCount:st.theoryCount,
                practicalCount:st.practicalCount
            });
        });
        this.setState({topicsPayload: stopics});
    }
  }
  public addTopic = (value) => {
      let topics = this.state.selectedTopics;
    if (this.topics.length > 0) {
      this.topics[value.topicIndex].selected = true;
      topics.push(this.topics[value.topicIndex]);
      this.setState({selectedTopics: topics, topicIndex: -1});
    }
  }
  removeSelectedTopic = (index) => {
      let topics = this.state.selectedTopics;
      topics.splice(index,1);
      this.setState({selectedTopics:topics});
  }
  public render() {
    const CoursesFetch = this.CourseListing;
    const TopicForm = this.AddTopic;

      return(
            <div styleName="container">
                <div styleName="content">
                    <h2>Create Assessment</h2>
                    {this.state.step === 1 && <CoursesFetch/>}
                    {this.state.step === 2 && <ModuleList modules={this.modules} onModuleSelect={this.onModuleSelect} /> }
                    <div styleName="course-container">
                        {this.state.step === 2 &&
                    <Query query={TOPICS} variables={{ moduleId: this.state.moduleId }}>
                        {({ data, error, loading }) => {
                          if (loading) {
                            return <Loader isVisible={loading} />;
                          }
                          if (error) {
                            return <ApolloError error={error} />;
                          }

                          if (!loading && !error) {
                            this.getTopicsList(data.topics);
                          }

                          return (<div styleName="topic-container">
                              {!loading && !error &&
                              <TopicList topics={this.topics} onTopicSelect={this.onTopicSelect}/>
                              }</div>);
                        }}
                    </Query>

                    }
                        {this.state.step === 2 && this.state.topicIndex >= 0 && <TopicForm topicIndex={this.state.topicIndex}/>}
                    </div>
                    {this.state.step === 2 && this.state.selectedTopics.length > 0 && <SelectedTopicList onTopicDelete={this.removeSelectedTopic} topics={this.state.selectedTopics}/>}
                    {this.state.step === 3 && <CreateNewAssessment topics={this.state.topicsPayload}/>}
                    {this.state.step<=2 && <button className="btn-primary" onClick={()=>{this.nextStep(this.state.step + 1)}}>Next</button>}

                </div>

            </div>
    );
  }

  public CourseListing = () => (
        <Query query={COURSES}>
            {({ data, error, loading }) => {
              if (loading) {
                return <Loader isVisible={loading} />;
              }

              if (error) {
                return <ApolloError error={error} />;
              }
              this.getCourseList(data.courses);
              return(
                    <div >
                        {!loading && !error && <CourseList courses={this.courses} onCourseSelect={this.onCourseSelect}/>}
                    </div>
              );
            }}
        </Query>
    )

    public AddTopic = (topic) => (
             <div styleName="content">
                 <div styleName="topic-form-container">
                <input type="text" styleName="input-style" onChange={(e) => {this.topics[topic.topicIndex].theoryCount = e.target.value;}} placeholder="Theory Count"/>
                <input type="text" styleName="input-style" onChange={(e) => {this.topics[topic.topicIndex].practicalCount = e.target.value;}}  placeholder="Practical Count"/>
                 <button className="btn-primary" onClick={()=>{this.addTopic(topic)}}>Add</button>
             </div>
             </div>
    )
}
export default CreateAssessment;
