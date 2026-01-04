-- Create interviews table for tracking interview performance
CREATE TABLE public.interviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 10),
  confidence TEXT NOT NULL CHECK (confidence IN ('low', 'medium', 'high')),
  hesitation BOOLEAN NOT NULL DEFAULT false,
  interview_type TEXT NOT NULL CHECK (interview_type IN ('hr', 'behavioral', 'technical')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  answer_length INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own interviews" 
ON public.interviews 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own interviews" 
ON public.interviews 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interviews" 
ON public.interviews 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interviews" 
ON public.interviews 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_interviews_user_id ON public.interviews(user_id);
CREATE INDEX idx_interviews_created_at ON public.interviews(created_at DESC);

-- Enable realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.interviews;